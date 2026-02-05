/**
 * World Map with City Markers
 * Shows cities on a world map with marker size representing occurrence frequency
 */
class CountryCitySankey {
    constructor() {
        this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.top - this.margin.bottom;
        
        // Color scale for markers (yellow to red based on frequency)
        this.colorScale = d3.scaleLinear()
            .range(['#fbbf24', '#ef4444']);
        
        // City to country mapping
        this.cityToCountry = {
            // North America
            'New York': 'USA', 'Los Angeles': 'USA', 'LA': 'USA', 'San Francisco': 'USA',
            'Chicago': 'USA', 'Las Vegas': 'USA', 'Miami': 'USA', 'Seattle': 'USA',
            'Boston': 'USA', 'Philadelphia': 'USA', 'Dallas': 'USA', 'Denver': 'USA',
            'Salt Lake City': 'USA', 'Portland': 'USA', 'Nashville': 'USA',
            'Cancun': 'Mexico', 'Mexico City': 'Mexico',
            'Vancouver': 'Canada', 'Montreal': 'Canada', 'Toronto': 'Canada',
            
            // Europe
            'London': 'UK', 'Edinburgh': 'UK', 'Bath': 'UK', 'Dover': 'UK', 'Henley': 'UK',
            'Paris': 'France',
            'Rome': 'Italy',
            'Barcelona': 'Spain', 'Madrid': 'Spain', 'Pampaneira': 'Spain',
            'Amsterdam': 'Netherlands',
            'Berlin': 'Germany', 'Munich': 'Germany', 'Boppard': 'Germany', 'Gottingen': 'Germany',
            'Vienna': 'Austria', 'Salzburg': 'Austria',
            'Prague': 'Czech Republic',
            'Zurich': 'Switzerland', 'Davos': 'Switzerland',
            'Dublin': 'Ireland',
            'Santorini': 'Greece',
            
            // Asia
            'Tokyo': 'Japan',
            'Dubai': 'UAE',
            'Singapore': 'Singapore',
            'Bangkok': 'Thailand',
            'Hong Kong': 'Hong Kong',
            'Seoul': 'South Korea',
            'Mumbai': 'India', 'Delhi': 'India', 'New Delhi': 'India', 'Bengaluru': 'India',
            'Bangalore': 'India', 'Goa': 'India', 'Kerala': 'India', 'Munnar': 'India',
            'Varanasi': 'India', 'Jaipur': 'India', 'Agra': 'India', 'Port Blair': 'India',
            'Sakleshpur': 'India', 'Nainital': 'India',
            'Ho Chi Minh': 'Vietnam', 'Hanoi': 'Vietnam',
            'Bali': 'Indonesia',
            'Jeddah': 'Saudi Arabia',
            
            // Australia & Pacific
            'Sydney': 'Australia', 'Melbourne': 'Australia', 'Melborne': 'Australia',
            'Brisbane': 'Australia', 'Perth': 'Australia', 'Cairns': 'Australia',
            'Gold Coast': 'Australia', 'Marysville': 'Australia',
            'Auckland': 'New Zealand', 'Wellington': 'New Zealand',
            'Maui': 'USA',
            
            // South America
            'Rio de Janeiro': 'Brazil',
            'Buenos Aires': 'Argentina',
            'Lima': 'Peru',
            'Bogota': 'Colombia',
            
            // Africa
            'Cape Town': 'South Africa', 'Johannesburg': 'South Africa',
            'Cairo': 'Egypt',
            'Marrakech': 'Morocco',
            
            // Middle East
            'Istanbul': 'Turkey',
            'Tel Aviv': 'Israel',
            
            // Others
            'Reykjavik': 'Iceland', 'Grindavik': 'Iceland',
            'Maldives': 'Maldives',
            'Key West': 'USA', 'Tiburon': 'USA', 'Vermont': 'USA', 'Aspen': 'USA', 'Yountville': 'USA'
        };
        
        // City coordinates (major cities mentioned in the data)
        this.cityCoordinates = {
            // North America
            'New York': [-74.0060, 40.7128],
            'Los Angeles': [-118.2437, 34.0522],
            'LA': [-118.2437, 34.0522],
            'San Francisco': [-122.4194, 37.7749],
            'Chicago': [-87.6298, 41.8781],
            'Las Vegas': [-115.1398, 36.1699],
            'Miami': [-80.1918, 25.7617],
            'Seattle': [-122.3321, 47.6062],
            'Boston': [-71.0589, 42.3601],
            'Philadelphia': [-75.1652, 39.9526],
            'Dallas': [-96.7970, 32.7767],
            'Denver': [-104.9903, 39.7392],
            'Salt Lake City': [-111.8910, 40.7608],
            'Portland': [-122.6765, 45.5152],
            'Nashville': [-86.7816, 36.1627],
            'Cancun': [-86.8515, 21.1619],
            'Mexico City': [-99.1332, 19.4326],
            'Vancouver': [-123.1207, 49.2827],
            'Montreal': [-73.5673, 45.5017],
            'Toronto': [-79.3832, 43.6532],
            
            // Europe
            'London': [-0.1278, 51.5074],
            'Paris': [-2.3522, 48.8566],
            'Rome': [12.4964, 41.9028],
            'Barcelona': [2.1734, 41.3851],
            'Amsterdam': [4.9041, 52.3676],
            'Berlin': [13.4050, 52.5200],
            'Madrid': [-3.7038, 40.4168],
            'Vienna': [16.3738, 48.2082],
            'Prague': [14.4378, 50.0755],
            'Zurich': [8.5417, 47.3769],
            'Munich': [11.5820, 48.1351],
            'Dublin': [-6.2603, 53.3498],
            'Edinburgh': [-3.1883, 55.9533],
            'Bath': [-2.3590, 51.3811],
            'Dover': [1.3134, 51.1279],
            'Henley': [-0.9030, 51.5356],
            'Santorini': [25.4615, 36.3932],
            'Pampaneira': [-3.3544, 36.9478],
            'Salzburg': [13.0550, 47.8095],
            'Boppard': [7.5894, 50.2317],
            'Gottingen': [9.9186, 51.5344],
            'Davos': [9.8368, 46.8029],
            
            // Asia
            'Tokyo': [139.6917, 35.6895],
            'Dubai': [55.2708, 25.2048],
            'Singapore': [103.8198, 1.3521],
            'Bangkok': [100.5018, 13.7563],
            'Hong Kong': [114.1694, 22.3193],
            'Seoul': [126.9780, 37.5665],
            'Mumbai': [72.8777, 19.0760],
            'Delhi': [77.1025, 28.7041],
            'New Delhi': [77.2090, 28.6139],
            'Bengaluru': [77.5946, 12.9716],
            'Bangalore': [77.5946, 12.9716],
            'Goa': [73.8278, 15.2993],
            'Kerala': [76.2711, 10.8505],
            'Munnar': [77.0591, 10.0889],
            'Varanasi': [82.9739, 25.3176],
            'Jaipur': [75.7873, 26.9124],
            'Agra': [78.0081, 27.1767],
            'Port Blair': [92.7265, 11.6234],
            'Sakleshpur': [75.7853, 12.9403],
            'Nainital': [79.4542, 29.3803],
            'Ho Chi Minh': [106.6297, 10.8231],
            'Hanoi': [105.8342, 21.0285],
            'Bali': [115.1889, -8.4095],
            'Jeddah': [39.1925, 21.5433],
            
            // Australia & Pacific
            'Sydney': [151.2093, -33.8688],
            'Melbourne': [144.9631, -37.8136],
            'Melborne': [144.9631, -37.8136],
            'Brisbane': [153.0251, -27.4698],
            'Perth': [115.8605, -31.9505],
            'Auckland': [174.7633, -36.8485],
            'Wellington': [-177.9235, -41.2865],
            'Cairns': [145.7781, -16.9186],
            'Gold Coast': [153.4000, -28.0167],
            'Marysville': [145.7472, -37.5104],
            'Maui': [-156.3319, 20.7984],
            
            // South America
            'Rio de Janeiro': [-43.1729, -22.9068],
            'Buenos Aires': [-58.3816, -34.6037],
            'Lima': [-77.0428, -12.0464],
            'Bogota': [-74.0721, 4.7110],
            
            // Africa
            'Cape Town': [18.4241, -33.9249],
            'Johannesburg': [28.0473, -26.2041],
            'Cairo': [31.2357, 30.0444],
            'Marrakech': [-7.9811, 31.6295],
            
            // Middle East
            'Istanbul': [28.9784, 41.0082],
            'Tel Aviv': [34.7818, 32.0853],
            
            // Others
            'Reykjavik': [-21.9426, 64.1466],
            'Grindavik': [-22.4340, 63.8424],
            'Maldives': [73.2207, 3.2028],
            'Key West': [-81.7800, 24.5551],
            'Tiburon': [-122.4564, 37.8735],
            'Vermont': [-72.5778, 44.5588],
            'Aspen': [-106.8175, 39.1911],
            'Yountville': [-122.3610, 38.4024]
        };
    }

    async render(container) {
        try {
            // Load CSV data
            const csvData = await this.loadCSV('data/cleaned_data.csv');
            
            // Process city occurrences
            const cityData = this.processCityData(csvData);
            
            if (cityData.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 50px; color: #9ca3af;">No city data available</p>';
                return;
            }
            
            // Update color scale domain
            const maxCount = d3.max(cityData, d => d.count);
            this.colorScale.domain([1, maxCount]);
            
            // Clear container
            container.innerHTML = '';
            
            // Create SVG
            const svg = d3.select(container)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .style('background', '#0a0a0a');
            
            // Add zoom behavior
            const zoom = d3.zoom()
                .scaleExtent([1, 8])  // Allow zoom from 1x to 8x
                .on('zoom', (event) => {
                    g.attr('transform', `translate(${this.margin.left},${this.margin.top}) ${event.transform}`);
                });
            
            svg.call(zoom);
            
            const g = svg.append('g')
                .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
            
            // Add title
            svg.append('text')
                .attr('x', (this.width + this.margin.left + this.margin.right) / 2)
                .attr('y', 15)
                .attr('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('font-weight', '500')
                .style('fill', '#9ca3af');
            
            // Create projection (Mercator for better city visibility)
            const projection = d3.geoMercator()
                .scale(130)
                .center([0, 30])
                .translate([this.width / 2, this.height / 2]);
            
            const path = d3.geoPath().projection(projection);
            
            // Load world map data
            const worldData = await this.loadWorldMap();
            
            // Draw world map
            g.selectAll('.country')
                .data(worldData.features)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', path)
                .style('fill', '#1f2937')
                .style('stroke', '#374151')
                .style('stroke-width', 0.5);
            
            // Create size scale for markers
            const sizeScale = d3.scaleSqrt()
                .domain([1, maxCount])
                .range([3, 15]);
            
            // Add city markers
            const markers = g.selectAll('.city-marker')
                .data(cityData)
                .enter()
                .append('circle')
                .attr('class', 'city-marker')
                .attr('cx', d => {
                    const coords = projection(d.coordinates);
                    return coords ? coords[0] : -1000;
                })
                .attr('cy', d => {
                    const coords = projection(d.coordinates);
                    return coords ? coords[1] : -1000;
                })
                .attr('r', 0)
                .style('fill', d => this.colorScale(d.count))
                .style('opacity', 0.8)
                .style('cursor', 'pointer')
                .on('mouseover', function(event, d) {
                    d3.select(this)
                        .style('opacity', 1)
                        .style('stroke', '#fbbf24')
                        .style('stroke-width', 2);
                    
                    // Remove any existing tooltips first
                    d3.selectAll('.map-tooltip').remove();
                    
                    // Show tooltip
                    d3.select('body').append('div')
                        .attr('class', 'map-tooltip')
                        .style('position', 'absolute')
                        .style('background', 'rgba(0, 0, 0, 0.9)')
                        .style('color', 'white')
                        .style('padding', '10px 14px')
                        .style('border-radius', '6px')
                        .style('font-size', '12px')
                        .style('pointer-events', 'none')
                        .style('z-index', '10000')
                        .style('border', '1px solid #fbbf24')
                        .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.3)')
                        .html(`
                            <div style="margin-bottom: 4px;">
                                <strong style="color: #fbbf24; font-size: 13px;">${d.city}</strong>
                            </div>
                            <div style="color: #d1d5db; margin-bottom: 2px;">
                                <span style="color: #9ca3af;">Country:</span> ${d.country}
                            </div>
                            <div style="color: #d1d5db;">
                                <span style="color: #9ca3af;">Prompts:</span> ${d.count}
                            </div>
                        `)
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 10) + 'px')
                        .style('opacity', 0)
                        .transition()
                        .duration(200)
                        .style('opacity', 1);
                })
                .on('mousemove', function(event) {
                    // Update tooltip position as mouse moves
                    d3.selectAll('.map-tooltip')
                        .style('left', (event.pageX + 10) + 'px')
                        .style('top', (event.pageY - 10) + 'px');
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .style('opacity', 0.8)
                        .style('stroke', 'none');
                    
                    d3.selectAll('.map-tooltip')
                        .transition()
                        .duration(200)
                        .style('opacity', 0)
                        .remove();
                })
                .transition()
                .duration(800)
                .delay((d, i) => i * 20)
                .attr('r', d => sizeScale(d.count));
            
            // Add description below the visualization
            this.addDescription(container);
            
        } catch (error) {
            console.error('Error rendering World Map:', error);
            container.innerHTML = `<p style="color: #ef4444; text-align: center; padding: 50px;">Error loading visualization: ${error.message}</p>`;
        }
    }
    
    addDescription(container) {
        // Only show description in fullscreen mode, not in preview grid
        const isPreviewMode = container.id.includes('preview') || container.closest('.viz-preview');
        
        if (isPreviewMode) {
            return; // Don't add description in preview mode
        }
        
        const description = document.createElement('div');
        description.className = 'viz-description';
        description.style.cssText = `
            padding: 16px;
            margin-top: 36px;
            background: #000000;
            border-left: 3px solid #fbbf24;
            color: #d1d5db;
            font-size: 13px;
            line-height: 1.6;
            border-radius: 4px;
            display: block;
        `;
        description.textContent = 'This visualization shows the geographic distribution of popular travel destinations worldwide. Each marker represents a city positioned according to its real-world location. The size of the marker indicates how frequently the city appears in the dataset. This helps identify regional travel hotspots.';
        
        container.appendChild(description);
    }

    processCityData(csvData) {
        const cityCounts = new Map();
        
        csvData.forEach(row => {
            if (!row.City || row.City.trim() === '') return;
            
            let cities = [];
            const cityValue = row.City.trim();
            
            // Handle curly braces format: {city1, city2, city3}
            if (cityValue.startsWith('{') && cityValue.endsWith('}')) {
                cities = cityValue
                    .slice(1, -1)
                    .split(',')
                    .map(c => c.trim())
                    .filter(c => c !== '');
            } 
            // Handle comma-separated format
            else if (cityValue.includes(',')) {
                cities = cityValue
                    .split(',')
                    .map(c => c.trim())
                    .filter(c => c !== '');
            } 
            // Single city
            else {
                cities = [cityValue];
            }
            
            // Count each city
            cities.forEach(city => {
                if (city && city !== '') {
                    cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
                }
            });
        });
        
        // Convert to array and filter cities with known coordinates
        const cityData = [];
        cityCounts.forEach((count, city) => {
            if (this.cityCoordinates[city]) {
                cityData.push({
                    city: city,
                    country: this.cityToCountry[city] || 'Unknown',
                    count: count,
                    coordinates: this.cityCoordinates[city]
                });
            }
        });
        
        // Sort by count (descending)
        cityData.sort((a, b) => b.count - a.count);
        
        return cityData;
    }

    async loadWorldMap() {
        // Simple world map GeoJSON
        const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
        const world = await response.json();
        return topojson.feature(world, world.objects.countries);
    }

    // CSV Loading Utilities
    async loadCSV(filePath) {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load CSV: ${response.statusText}`);
        }
        const text = await response.text();
        return this.parseCSV(text);
    }

    parseCSV(text) {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return [];
        
        // Parse header
        const headers = this.parseCSVLine(lines[0]);
        
        // Parse data rows
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }
        
        return data;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }
}
