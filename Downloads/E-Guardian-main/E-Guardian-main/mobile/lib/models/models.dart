class Device {
  final String id;
  final String name;
  final String category;
  final String hazardLevel;
  final String classificationResults;
  final List<String> recommendations;
  final String? imageUrl;
  final String status;
  final DateTime createdAt;

  Device({
    required this.id,
    required this.name,
    required this.category,
    required this.hazardLevel,
    required this.classificationResults,
    required this.recommendations,
    this.imageUrl,
    required this.status,
    required this.createdAt,
  });

  factory Device.fromJson(Map<String, dynamic> json) {
    return Device(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      hazardLevel: json['hazardLevel']?.toString() ?? 'Low',
      classificationResults:
          json['classificationResults']?.toString() ?? '',
      recommendations: List<String>.from(
          (json['recommendations'] as List<dynamic>? ?? [])
              .map((x) => x.toString())),
      imageUrl: json['imageUrl']?.toString(),
      status: json['status']?.toString() ?? 'detected',
      createdAt: DateTime.tryParse(json['createdAt']?.toString() ?? '') ??
          DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() => {
        '_id': id,
        'name': name,
        'category': category,
        'hazardLevel': hazardLevel,
        'classificationResults': classificationResults,
        'recommendations': recommendations,
        'imageUrl': imageUrl,
        'status': status,
        'createdAt': createdAt.toIso8601String(),
      };
}

class User {
  final String id;
  final String name;
  final String email;
  final String role;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      role: json['role']?.toString() ?? 'user',
    );
  }
}

class AnalysisResult {
  final String deviceType;
  final String riskLevel;
  final List<String> hazards;
  final List<String> disposalSteps;
  final List<RecyclingCenter> recyclingCenters;
  final EnvironmentalImpact impact;

  AnalysisResult({
    required this.deviceType,
    required this.riskLevel,
    required this.hazards,
    required this.disposalSteps,
    required this.recyclingCenters,
    required this.impact,
  });
}

class RecyclingCenter {
  final String id;
  final String name;
  final String address;
  final double latitude;
  final double longitude;

  RecyclingCenter({
    required this.id,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
  });

  factory RecyclingCenter.fromJson(Map<String, dynamic> json) {
    return RecyclingCenter(
      id: json['_id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      address: json['address']?.toString() ?? '',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

class EnvironmentalImpact {
  final double co2Saved;
  final double wasteReduced;
  final int treesEquivalent;

  EnvironmentalImpact({
    required this.co2Saved,
    required this.wasteReduced,
    required this.treesEquivalent,
  });
}

enum DeviceStatus { detected, recycled, disposed }

extension DeviceStatusExtension on DeviceStatus {
  String get value {
    switch (this) {
      case DeviceStatus.detected:
        return 'detected';
      case DeviceStatus.recycled:
        return 'recycled';
      case DeviceStatus.disposed:
        return 'disposed';
    }
  }
}

enum HazardLevel { low, medium, high }

extension HazardLevelExtension on HazardLevel {
  String get value {
    switch (this) {
      case HazardLevel.low:
        return 'Low';
      case HazardLevel.medium:
        return 'Medium';
      case HazardLevel.high:
        return 'High';
    }
  }

  static HazardLevel fromString(String value) {
    switch (value.toLowerCase()) {
      case 'high':
        return HazardLevel.high;
      case 'medium':
        return HazardLevel.medium;
      default:
        return HazardLevel.low;
    }
  }
}
