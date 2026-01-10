import requests
import sys
import json
from datetime import datetime

class BloomAgricultureAPITester:
    def __init__(self, base_url="https://bloom-redesign-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_seed_database(self):
        """Seed the database with initial data"""
        return self.run_test("Seed Database", "POST", "seed", 200)

    def test_gallery_endpoints(self):
        """Test all gallery-related endpoints"""
        print("\n📸 Testing Gallery Endpoints...")
        
        # Get all gallery items
        success, gallery_data = self.run_test("Get Gallery Items", "GET", "gallery", 200)
        if not success:
            return False
            
        # Test gallery filters
        self.run_test("Get Gallery by Category", "GET", "gallery?category=products", 200)
        self.run_test("Get Gallery (Active Only)", "GET", "gallery?active_only=true", 200)
        
        # If we have gallery items, test getting a specific one
        if gallery_data and len(gallery_data) > 0:
            item_id = gallery_data[0].get('id')
            if item_id:
                self.run_test("Get Specific Gallery Item", "GET", f"gallery/{item_id}", 200)
        
        return True

    def test_events_endpoints(self):
        """Test all event-related endpoints"""
        print("\n📅 Testing Events Endpoints...")
        
        # Get all events
        success, events_data = self.run_test("Get Events", "GET", "events", 200)
        if not success:
            return False
            
        # Test event filters
        self.run_test("Get Events by Category", "GET", "events?category=workshop", 200)
        self.run_test("Get Featured Events", "GET", "events?featured_only=true", 200)
        self.run_test("Get Events (Active Only)", "GET", "events?active_only=true", 200)
        
        # If we have events, test getting a specific one
        if events_data and len(events_data) > 0:
            event_id = events_data[0].get('id')
            if event_id:
                self.run_test("Get Specific Event", "GET", f"events/{event_id}", 200)
        
        return True

    def test_contact_endpoints(self):
        """Test contact message endpoints"""
        print("\n📧 Testing Contact Endpoints...")
        
        # Create a test contact message
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "081234567",
            "message": "This is a test message from the API tester."
        }
        
        success, response = self.run_test("Create Contact Message", "POST", "contact", 200, contact_data)
        if not success:
            return False
            
        # Get all contact messages
        self.run_test("Get Contact Messages", "GET", "contact", 200)
        
        return True

    def test_admin_endpoints(self):
        """Test admin authentication and stats"""
        print("\n🔐 Testing Admin Endpoints...")
        
        # Test admin login
        login_data = {
            "username": "admin",
            "password": "bloom2024"
        }
        
        success, response = self.run_test("Admin Login", "POST", "admin/login", 200, login_data)
        if success and response.get('token'):
            self.token = response['token']
            print(f"   Token received: {self.token[:20]}...")
            
            # Test admin stats
            self.run_test("Get Admin Stats", "GET", "admin/stats", 200)
        
        return success

    def test_status_endpoints(self):
        """Test status check endpoints"""
        print("\n📊 Testing Status Endpoints...")
        
        # Create a status check
        status_data = {
            "client_name": "API Tester"
        }
        
        self.run_test("Create Status Check", "POST", "status", 200, status_data)
        self.run_test("Get Status Checks", "GET", "status", 200)
        
        return True

def main():
    print("🌱 Starting Bloom Agriculture API Tests...")
    print("=" * 60)
    
    # Setup
    tester = BloomAgricultureAPITester()
    
    # Test sequence
    try:
        # Basic connectivity
        tester.test_root_endpoint()
        
        # Seed database first
        tester.test_seed_database()
        
        # Test main endpoints
        tester.test_gallery_endpoints()
        tester.test_events_endpoints()
        tester.test_contact_endpoints()
        tester.test_admin_endpoints()
        tester.test_status_endpoints()
        
    except Exception as e:
        print(f"\n💥 Unexpected error during testing: {str(e)}")
        return 1

    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed! Backend API is working correctly.")
        return 0
    else:
        failed_tests = tester.tests_run - tester.tests_passed
        print(f"⚠️  {failed_tests} test(s) failed. Please check the backend implementation.")
        return 1

if __name__ == "__main__":
    sys.exit(main())