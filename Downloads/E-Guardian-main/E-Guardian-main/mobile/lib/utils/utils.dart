import 'dart:io';
import 'package:image_picker/image_picker.dart';

class ImageUtils {
  static Future<File?> compressImage(File imageFile) async {
    // In production, use image package for actual compression
    // For now, just return the original file
    return imageFile;
  }

  static bool isValidImageSize(File file) {
    final bytes = file.lengthSync();
    const maxSize = 5 * 1024 * 1024; // 5MB
    return bytes <= maxSize;
  }
}

class ValidationUtils {
  static bool isValidEmail(String email) {
    final emailRegex =
        RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    return emailRegex.hasMatch(email);
  }

  static bool isValidPassword(String password) {
    return password.length >= 6;
  }

  static bool isValidName(String name) {
    return name.trim().isNotEmpty && name.length >= 2;
  }

  static bool isValidDeviceName(String name) {
    return name.trim().isNotEmpty && name.length >= 2;
  }

  static bool isValidCategory(String category) {
    return category.trim().isNotEmpty;
  }
}

class FormatUtils {
  static String formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }

  static String formatCO2(double co2) {
    return '${co2.toStringAsFixed(2)} kg';
  }

  static String capitalizeFirst(String text) {
    if (text.isEmpty) return '';
    return text[0].toUpperCase() + text.substring(1);
  }
}

class ErrorHandler {
  static String getErrorMessage(dynamic error) {
    if (error is Exception) {
      final message = error.toString();
      if (message.contains('Connection refused')) {
        return 'Could not connect to server. Please check your internet.';
      } else if (message.contains('SocketException')) {
        return 'Network error. Please check your connection.';
      } else if (message.contains('Invalid credentials')) {
        return 'Invalid email or password.';
      } else if (message.contains('already exists')) {
        return 'Email already registered.';
      }
    }
    return 'An error occurred. Please try again.';
  }
}

class Constants {
  static const List<String> deviceCategories = [
    'Phone',
    'Laptop',
    'Tablet',
    'Monitor',
    'Keyboard',
    'Mouse',
    'Charger',
    'Battery',
    'Printer',
    'Camera',
    'Speaker',
    'Headphones',
    'Server',
    'Router',
    'Other'
  ];

  static const Map<String, String> deviceEmojis = {
    'Phone': '📱',
    'Laptop': '💻',
    'Tablet': '📱',
    'Monitor': '🖥️',
    'Keyboard': '⌨️',
    'Mouse': '🖱️',
    'Charger': '🔌',
    'Battery': '🔋',
    'Printer': '🖨️',
    'Camera': '📷',
    'Speaker': '🔊',
    'Headphones': '🎧',
    'Server': '🖥️',
    'Router': '📡',
    'Other': '⚙️'
  };
}
