import requests
import sys
import json
from datetime import datetime

class AuthAPITester:
    def __init__(self, base_url="https://rapid-login-setup.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def test_health_check(self):
        """Test if the API is accessible"""
        try:
            response = self.session.get(f"{self.base_url}/api/auth/me")
            # We expect 401 for unauthenticated request, which means API is working
            success = response.status_code in [401, 422]
            self.log_test("API Health Check", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("API Health Check", False, str(e))
            return False

    def test_login_valid_credentials(self):
        """Test login with valid admin credentials"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/auth/login",
                json={"email": "admin@example.com", "password": "admin123"}
            )
            success = response.status_code == 200
            if success:
                data = response.json()
                success = all(key in data for key in ["id", "email", "name", "role"])
                if success:
                    print(f"   User: {data.get('name')} ({data.get('email')}) - Role: {data.get('role')}")
            self.log_test("Login with Valid Credentials", success, 
                         f"Status: {response.status_code}, Response: {response.text[:100]}")
            return success
        except Exception as e:
            self.log_test("Login with Valid Credentials", False, str(e))
            return False

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/auth/login",
                json={"email": "admin@example.com", "password": "wrongpassword"}
            )
            success = response.status_code == 401
            self.log_test("Login with Invalid Credentials", success, 
                         f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Login with Invalid Credentials", False, str(e))
            return False

    def test_auth_me_authenticated(self):
        """Test /api/auth/me with authenticated session"""
        try:
            # First login
            login_response = self.session.post(
                f"{self.base_url}/api/auth/login",
                json={"email": "admin@example.com", "password": "admin123"}
            )
            
            if login_response.status_code != 200:
                self.log_test("Auth Me (Authenticated)", False, "Login failed first")
                return False
            
            # Then test /me endpoint
            response = self.session.get(f"{self.base_url}/api/auth/me")
            success = response.status_code == 200
            if success:
                data = response.json()
                success = all(key in data for key in ["id", "email", "name", "role"])
                if success:
                    print(f"   Authenticated user: {data.get('email')} - {data.get('role')}")
            
            self.log_test("Auth Me (Authenticated)", success, 
                         f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Auth Me (Authenticated)", False, str(e))
            return False

    def test_auth_me_unauthenticated(self):
        """Test /api/auth/me without authentication"""
        try:
            # Create new session without cookies
            temp_session = requests.Session()
            response = temp_session.get(f"{self.base_url}/api/auth/me")
            success = response.status_code == 401
            self.log_test("Auth Me (Unauthenticated)", success, 
                         f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Auth Me (Unauthenticated)", False, str(e))
            return False

    def test_logout(self):
        """Test logout functionality"""
        try:
            # First login
            login_response = self.session.post(
                f"{self.base_url}/api/auth/login",
                json={"email": "admin@example.com", "password": "admin123"}
            )
            
            if login_response.status_code != 200:
                self.log_test("Logout", False, "Login failed first")
                return False
            
            # Then logout
            logout_response = self.session.post(f"{self.base_url}/api/auth/logout")
            success = logout_response.status_code == 200
            
            if success:
                # Verify we're logged out by testing /me
                me_response = self.session.get(f"{self.base_url}/api/auth/me")
                success = me_response.status_code == 401
            
            self.log_test("Logout", success, 
                         f"Logout Status: {logout_response.status_code}, Me Status: {me_response.status_code}")
            return success
        except Exception as e:
            self.log_test("Logout", False, str(e))
            return False

    def test_register_new_user(self):
        """Test user registration"""
        try:
            test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
            response = self.session.post(
                f"{self.base_url}/api/auth/register",
                json={
                    "email": test_email,
                    "password": "testpass123",
                    "name": "Test User"
                }
            )
            success = response.status_code == 200
            if success:
                data = response.json()
                success = all(key in data for key in ["id", "email", "name", "role"])
                if success:
                    print(f"   Registered: {data.get('email')} - Role: {data.get('role')}")
            
            self.log_test("Register New User", success, 
                         f"Status: {response.status_code}, Email: {test_email}")
            return success
        except Exception as e:
            self.log_test("Register New User", False, str(e))
            return False

    def test_register_duplicate_email(self):
        """Test registration with duplicate email"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/auth/register",
                json={
                    "email": "admin@example.com",  # This should already exist
                    "password": "testpass123",
                    "name": "Duplicate User"
                }
            )
            success = response.status_code == 400
            self.log_test("Register Duplicate Email", success, 
                         f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Register Duplicate Email", False, str(e))
            return False

    def test_brute_force_protection(self):
        """Test brute force protection (5 failed attempts)"""
        try:
            temp_session = requests.Session()
            failed_attempts = 0
            
            # Try 6 failed login attempts
            for i in range(6):
                response = temp_session.post(
                    f"{self.base_url}/api/auth/login",
                    json={"email": "admin@example.com", "password": f"wrong{i}"}
                )
                if response.status_code == 401:
                    failed_attempts += 1
                elif response.status_code == 429:
                    # Brute force protection kicked in
                    success = failed_attempts >= 5
                    self.log_test("Brute Force Protection", success, 
                                 f"Locked after {failed_attempts} attempts")
                    return success
            
            # If we get here, brute force protection didn't work
            self.log_test("Brute Force Protection", False, 
                         f"No lockout after {failed_attempts} attempts")
            return False
        except Exception as e:
            self.log_test("Brute Force Protection", False, str(e))
            return False

    def run_all_tests(self):
        """Run all authentication tests"""
        print("🔍 Starting Authentication API Tests...")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Run tests in order
        tests = [
            self.test_health_check,
            self.test_login_valid_credentials,
            self.test_login_invalid_credentials,
            self.test_auth_me_authenticated,
            self.test_auth_me_unauthenticated,
            self.test_logout,
            self.test_register_new_user,
            self.test_register_duplicate_email,
            self.test_brute_force_protection
        ]
        
        for test in tests:
            test()
            print()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Tests Summary: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("❌ Some tests failed!")
            return False

def main():
    tester = AuthAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open("/app/backend_test_results.json", "w") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total_tests": tester.tests_run,
            "passed_tests": tester.tests_passed,
            "success_rate": f"{(tester.tests_passed/tester.tests_run)*100:.1f}%",
            "results": tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())