from flask import Flask, request, jsonify
import osmnx as ox
import networkx as nx

app = Flask(__name__)

@app.route('/api/route', methods=['POST'])
def calculate_route():
    data = request.json
    start = data['start']
    end = data['end']

    try:
        # Use OpenStreetMap data to calculate route
        G = ox.graph_from_point((start['lat'], start['lng']), dist=1000)
        origin_node = ox.distance.nearest_nodes(G, start['lng'], start['lat'])
        destination_node = ox.distance.nearest_nodes(G, end['lng'], end['lat'])

        # Calculate shortest path
        route = nx.shortest_path(G, origin_node, destination_node, weight='length')

        # Convert route to lat/lng coordinates
        route_coords = [
            {'lat': G.nodes[node]['y'], 'lng': G.nodes[node]['x']}
            for node in route
        ]

        return jsonify({'route': route_coords})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
