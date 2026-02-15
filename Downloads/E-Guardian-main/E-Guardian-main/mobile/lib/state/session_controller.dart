import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../config.dart';
import '../services/api_client.dart';
import '../services/auth_service.dart';
import '../services/device_service.dart';
import '../services/other_service.dart';

class SessionController extends ChangeNotifier {
  SessionController({String baseUrl = kApiBaseUrl})
      : _api = ApiClient(
          baseUrl: baseUrl,
          tokenProvider: () => null,
        ) {
    _apiWithToken = ApiClient(
      baseUrl: baseUrl,
      tokenProvider: () => _token,
    );
    authService = AuthService(_apiWithToken);
    deviceService = DeviceService(_apiWithToken);
    otherService = OtherService(_api);
  }

  late final ApiClient _api;
  late final ApiClient _apiWithToken;
  late final AuthService authService;
  late final DeviceService deviceService;
  late final OtherService otherService;

  String? _token;
  Map<String, dynamic>? _user;
  bool _isLoading = true;

  String? get token => _token;
  Map<String, dynamic>? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _token != null && _token!.isNotEmpty;

  Future<void> init() async {
    _isLoading = true;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');

    if (_token != null && _token!.isNotEmpty) {
      try {
        _user = await authService.getMe();
      } catch (_) {
        await logout();
      }
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    final response = await authService.login(email: email, password: password);
    await _setSessionFromAuth(response);
  }

  Future<void> register(String name, String email, String password) async {
    final response = await authService.register(
      name: name,
      email: email,
      password: password,
    );
    await _setSessionFromAuth(response);
  }

  Future<void> _setSessionFromAuth(Map<String, dynamic> response) async {
    final token = response['token']?.toString();
    if (token == null || token.isEmpty) {
      throw ApiException('Missing token in response');
    }
    _token = token;
    _user = response['user'] as Map<String, dynamic>?;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
    notifyListeners();
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    notifyListeners();
  }
}
