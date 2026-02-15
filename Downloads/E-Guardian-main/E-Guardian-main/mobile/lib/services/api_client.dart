import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiException implements Exception {
  ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => 'ApiException($statusCode): $message';
}

typedef TokenProvider = String? Function();

class ApiClient {
  ApiClient({
    required this.baseUrl,
    required this.tokenProvider,
  });

  final String baseUrl;
  final TokenProvider tokenProvider;

  Map<String, String> _headers({bool json = true, bool auth = false}) {
    final headers = <String, String>{};
    if (json) {
      headers['Content-Type'] = 'application/json';
    }
    if (auth) {
      final token = tokenProvider();
      if (token != null && token.isNotEmpty) {
        headers['x-auth-token'] = token;
      }
    }
    return headers;
  }

  Uri _uri(String path) {
    final normalized = path.startsWith('/') ? path : '/$path';
    return Uri.parse('$baseUrl$normalized');
  }

  Future<Map<String, dynamic>> getJson(String path, {bool auth = false}) async {
    final response = await http.get(_uri(path), headers: _headers(auth: auth));
    return _decode(response);
  }

  Future<Map<String, dynamic>> postJson(
    String path,
    Map<String, dynamic> body, {
    bool auth = false,
  }) async {
    final response = await http.post(
      _uri(path),
      headers: _headers(auth: auth),
      body: jsonEncode(body),
    );
    return _decode(response);
  }

  Future<List<dynamic>> getList(String path, {bool auth = false}) async {
    final response = await http.get(_uri(path), headers: _headers(auth: auth));
    return _decodeList(response);
  }

  Future<List<dynamic>> postList(
    String path,
    Map<String, dynamic> body, {
    bool auth = false,
  }) async {
    final response = await http.post(
      _uri(path),
      headers: _headers(auth: auth),
      body: jsonEncode(body),
    );
    return _decodeList(response);
  }

  Future<Map<String, dynamic>> postMultipart(
    String path, {
    required Map<String, String> fields,
    required String fileField,
    required String filePath,
    bool auth = false,
  }) async {
    final request = http.MultipartRequest('POST', _uri(path));
    request.headers.addAll(_headers(json: false, auth: auth));
    request.fields.addAll(fields);
    request.files.add(await http.MultipartFile.fromPath(fileField, filePath));

    final streamed = await request.send();
    final response = await http.Response.fromStream(streamed);
    return _decode(response);
  }

  Map<String, dynamic> _decode(http.Response response) {
    final body = response.body.isNotEmpty ? jsonDecode(response.body) : null;
    if (response.statusCode >= 400) {
      final message = body is Map<String, dynamic>
          ? (body['msg']?.toString() ?? body['error']?.toString() ?? 'Request failed')
          : 'Request failed';
      throw ApiException(message, statusCode: response.statusCode);
    }
    if (body is Map<String, dynamic>) {
      return body;
    }
    return <String, dynamic>{};
  }

  List<dynamic> _decodeList(http.Response response) {
    final body = response.body.isNotEmpty ? jsonDecode(response.body) : null;
    if (response.statusCode >= 400) {
      final message = body is Map<String, dynamic>
          ? (body['msg']?.toString() ?? body['error']?.toString() ?? 'Request failed')
          : 'Request failed';
      throw ApiException(message, statusCode: response.statusCode);
    }
    if (body is List) {
      return body;
    }
    return <dynamic>[];
  }
}
