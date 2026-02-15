import 'package:flutter/material.dart';

import '../app.dart';
import '../config.dart';
import '../services/api_client.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isLoading = true;
  String? _error;
  Map<String, dynamic>? _stats;
  List<dynamic> _devices = [];

  String? _resolveImageUrl(String? imageUrl) {
    if (imageUrl == null || imageUrl.isEmpty) {
      return null;
    }
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    final base = kApiBaseUrl.replaceFirst(RegExp(r'/api/?$'), '');
    return '$base$imageUrl';
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    final session = AppScope.of(context);
    try {
      final stats = await session.deviceService.getStats();
      final devices = await session.deviceService.getDevices();
      if (mounted) {
        setState(() {
          _stats = stats;
          _devices = devices;
          _isLoading = false;
        });
      }
    } on ApiException catch (err) {
      if (mounted) {
        setState(() {
          _error = err.message;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _error = 'Failed to load dashboard.';
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null) {
      return Center(child: Text(_error!));
    }
    final stats = _stats ?? {};
    final session = AppScope.of(context);
    final userName = session.user?['name']?.toString() ?? 'there';
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Hello, $userName',
              style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 4),
          Text('Track your impact and recent scans.',
              style: Theme.of(context).textTheme.bodyMedium),
          const SizedBox(height: 16),
          Text('Summary', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          LayoutBuilder(
            builder: (context, constraints) {
              final maxWidth = constraints.maxWidth;
              final columns = maxWidth < 360
                  ? 1
                  : maxWidth >= 900
                      ? 3
                      : 2;
              final tileWidth =
                  (maxWidth - (columns - 1) * 12) / columns;

              return Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  _StatTile(
                    width: tileWidth,
                    title: 'Total devices',
                    value: '${stats['totalDevices'] ?? 0}',
                    icon: Icons.devices,
                  ),
                  _StatTile(
                    width: tileWidth,
                    title: 'High hazard',
                    value: '${stats['highHazardDevices'] ?? 0}',
                    icon: Icons.warning_amber_outlined,
                  ),
                  _StatTile(
                    width: tileWidth,
                    title: 'CO2 saved (kg)',
                    value: '${stats['co2Saved'] ?? 0}',
                    icon: Icons.eco_outlined,
                  ),
                ],
              );
            },
          ),
          const SizedBox(height: 16),
          Text('Recent scans', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          if (_devices.isEmpty) const Text('No devices scanned yet.'),
          for (final device in _devices.take(5))
            _RecentScanCard(
              name: device['name']?.toString() ?? 'Unknown',
              category: device['category']?.toString() ?? '',
              hazard: device['hazardLevel']?.toString() ?? 'Low',
              imageUrl: _resolveImageUrl(device['imageUrl']?.toString()),
              status: device['status']?.toString() ?? 'detected',
            ),
        ],
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({
    Key? key,
    required this.width,
    required this.title,
    required this.value,
    required this.icon,
  }) : super(key: key);

  final double width;
  final String title;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon),
              const SizedBox(height: 8),
              Text(title, style: Theme.of(context).textTheme.bodySmall),
              const SizedBox(height: 4),
              Text(value, style: Theme.of(context).textTheme.headlineSmall),
            ],
          ),
        ),
      ),
    );
  }
}

class _RecentScanCard extends StatelessWidget {
  const _RecentScanCard({
    Key? key,
    required this.name,
    required this.category,
    required this.hazard,
    required this.imageUrl,
    required this.status,
  }) : super(key: key);

  final String name;
  final String category;
  final String hazard;
  final String? imageUrl;
  final String status;

  Color _hazardColor(BuildContext context) {
    switch (hazard.toLowerCase()) {
      case 'high':
        return Colors.red.shade400;
      case 'medium':
        return Colors.orange.shade400;
      default:
        return Colors.green.shade400;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                color: Theme.of(context).colorScheme.surfaceVariant,
                image: imageUrl == null
                    ? null
                    : DecorationImage(
                        image: ResizeImage(
                          NetworkImage(imageUrl!),
                          width: 112,
                          height: 112,
                        ),
                        fit: BoxFit.cover,
                      ),
              ),
              child: imageUrl == null ? const Icon(Icons.photo_outlined) : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 4),
                  Text(category, style: Theme.of(context).textTheme.bodySmall),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _hazardColor(context).withOpacity(0.15),
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          'Hazard: $hazard',
                          style: Theme.of(context)
                              .textTheme
                              .labelSmall
                              ?.copyWith(color: _hazardColor(context)),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text('Status: $status',
                          style: Theme.of(context).textTheme.labelSmall),
                    ],
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
