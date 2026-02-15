import 'package:flutter/material.dart';

import '../app.dart';
import 'dashboard_screen.dart';
import 'map_screen.dart';
import 'results_screen.dart';
import 'scan_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({Key? key}) : super(key: key);

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _index = 0;

  final _screens = const [
    DashboardScreen(),
    MapScreen(),
    ScanScreen(),
    ResultsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final session = AppScope.of(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('E-Guardian'),
        actions: [
          IconButton(
            onPressed: () => session.logout(),
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
          ),
        ],
      ),
      body: _screens[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.map_outlined),
            label: 'Map',
          ),
          NavigationDestination(
            icon: Icon(Icons.qr_code_scanner_outlined),
            label: 'Scan',
          ),
          NavigationDestination(
            icon: Icon(Icons.list_alt_outlined),
            label: 'Results',
          ),
        ],
      ),
    );
  }
}
