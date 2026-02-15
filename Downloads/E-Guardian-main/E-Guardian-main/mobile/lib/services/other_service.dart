import 'api_client.dart';

class OtherService {
  OtherService(this._api);

  final ApiClient _api;

  Future<List<dynamic>> getCenters() async {
    return _api.getList('/centers');
  }

  Future<List<dynamic>> getHazards() async {
    return _api.getList('/hazards');
  }
}
