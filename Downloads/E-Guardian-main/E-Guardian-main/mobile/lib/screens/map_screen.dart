import 'package:flutter/material.dart';

import '../app.dart';
import '../services/api_client.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({Key? key}) : super(key: key);

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  bool _isLoading = true;
  String? _error;
  List<dynamic> _centers = [];
  List<dynamic> _hazards = [];

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
      final centers = await session.otherService.getCenters();
      final hazards = await session.otherService.getHazards();
      if (mounted) {
        setState(() {
          _centers = centers;
          _hazards = hazards;
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
          _error = 'Failed to load map data.';
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
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Map overview', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          Card(
            child: Container(
              height: 180,
              alignment: Alignment.center,
              child: const Text('Interactive map coming soon'),
            ),
          ),
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
                  _SummaryTile(
                    width: tileWidth,
                    title: 'Centers',
                    value: '${_centers.length}',
                    icon: Icons.location_city_outlined,
                  ),
                  _SummaryTile(
                    width: tileWidth,
                    title: 'Hazards',
                    value: '${_hazards.length}',
                    icon: Icons.warning_amber_outlined,
                  ),
                ],
              );
            },
          ),
          const SizedBox(height: 16),
          Text('Recycling centers',
              style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          if (_centers.isEmpty) const Text('No centers available.'),
          for (final center in _centers)
            _InfoCard(
              title: center['name']?.toString() ?? 'Center',
              subtitle: center['address']?.toString() ?? '',
              icon: Icons.recycling_outlined,
            ),
          const SizedBox(height: 16),
          Text('Hazard alerts', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          if (_hazards.isEmpty) const Text('No hazards reported.'),
          for (final hazard in _hazards)
            _InfoCard(
              title: hazard['title']?.toString() ?? 'Hazard',
              subtitle: hazard['description']?.toString() ?? '',
              icon: Icons.report_gmailerrorred_outlined,
            ),
        ],
      ),
    );
  }
}

class _SummaryTile extends StatelessWidget {
  const _SummaryTile({
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

class _InfoCard extends StatelessWidget {
  const _InfoCard({
    Key? key,
    required this.title,
    required this.subtitle,
    required this.icon,
  }) : super(key: key);

  final String title;
  final String subtitle;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        subtitle: Text(subtitle),
      ),
    );
  }
}
