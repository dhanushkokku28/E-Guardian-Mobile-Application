import 'api_client.dart';

class AuthService {
  AuthService(this._api);

  final ApiClient _api;

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    return _api.postJson('/auth/login', {
      'email': email.trim(),
      'password': password,
    });
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    return _api.postJson('/auth/register', {
      'name': name.trim(),
      'email': email.trim(),
      'password': password,
    });
  }

  Future<Map<String, dynamic>> getMe() async {
    return _api.getJson('/auth/me', auth: true);
  }
}
