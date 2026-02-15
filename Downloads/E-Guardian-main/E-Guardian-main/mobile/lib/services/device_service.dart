import 'api_client.dart';

class DeviceService {
  DeviceService(this._api);

  final ApiClient _api;

  Future<Map<String, dynamic>> getStats() async {
    return _api.getJson('/devices/stats', auth: true);
  }

  Future<List<dynamic>> getDevices() async {
    return _api.getList('/devices', auth: true);
  }

  Future<Map<String, dynamic>> classifyDevice({
    required String name,
    required String category,
    String? imageUrl,
  }) async {
    return _api.postJson('/devices/classify', {
      'name': name.trim(),
      'category': category.trim(),
      'imageUrl': imageUrl?.trim(),
    }, auth: true);
  }

  Future<Map<String, dynamic>> classifyDeviceWithImage({
    required String name,
    required String category,
    required String imagePath,
  }) async {
    return _api.postMultipart(
      '/devices/classify-image',
      fields: {
        'name': name.trim(),
        'category': category.trim(),
      },
      fileField: 'image',
      filePath: imagePath,
      auth: true,
    );
  }
}
