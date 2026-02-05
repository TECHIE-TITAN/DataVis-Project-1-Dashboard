// ============================================
// Visualization 5: Accommodation on World Map
// ============================================

class WorldMapAccommodations {
    constructor() {
        this.colors = {
            'Hotel': '#ef4444',
            'Hostel': '#f97316',
            'AirBnB': '#fbbf24',
            'Camping': '#fb923c',
            'Villa': '#fdba74'
        };
        
        // City to country mapping
        this.cityToCountry = {
            'New York': 'USA', 'Los Angeles': 'USA', 'LA': 'USA', 'Chicago': 'USA',
            'San Francisco': 'USA', 'SF': 'USA', 'Seattle': 'USA', 'Boston': 'USA',
            'Miami': 'USA', 'Las Vegas': 'USA', 'Philadelphia': 'USA', 'Dallas': 'USA',
            'Denver': 'USA', 'Salt Lake City': 'USA', 'Portland': 'USA', 'Nashville': 'USA',
            'Phoenix': 'USA', 'Austin': 'USA', 'New Orleans': 'USA', 'San Diego': 'USA',
            'Tampa': 'USA', 'Orlando': 'USA', 'Atlanta': 'USA', 'Washington': 'USA',
            'NYC': 'USA', 'Maui': 'USA', 'Honolulu': 'USA',
            'London': 'UK', 'Edinburgh': 'UK', 'Dublin': 'Ireland',
            'Paris': 'France', 'Rome': 'Italy', 'Berlin': 'Germany', 'Madrid': 'Spain',
            'Amsterdam': 'Netherlands', 'Barcelona': 'Spain', 'Munich': 'Germany',
            'Vienna': 'Austria', 'Prague': 'Czech Republic', 'Zurich': 'Switzerland',
            'Geneva': 'Switzerland', 'Athens': 'Greece', 'Lisbon': 'Portugal',
            'Porto': 'Portugal', 'Copenhagen': 'Denmark', 'Stockholm': 'Sweden',
            'Oslo': 'Norway', 'Helsinki': 'Finland', 'Warsaw': 'Poland',
            'Budapest': 'Hungary', 'Brussels': 'Belgium', 'Bruges': 'Belgium',
            'Reykjavik': 'Iceland', 'Santorini': 'Greece', 'Mykonos': 'Greece',
            'Venice': 'Italy', 'Florence': 'Italy', 'Milan': 'Italy', 'Naples': 'Italy',
            'Tokyo': 'Japan', 'Sydney': 'Australia', 'Melbourne': 'Australia',
            'Bangkok': 'Thailand', 'Singapore': 'Singapore', 'Dubai': 'UAE',
            'Delhi': 'India', 'New Delhi': 'India', 'Mumbai': 'India', 'Bengaluru': 'India',
            'Shanghai': 'China', 'Beijing': 'China', 'Hong Kong': 'Hong Kong',
            'Seoul': 'South Korea', 'Istanbul': 'Turkey', 'Moscow': 'Russia',
            'Toronto': 'Canada', 'Vancouver': 'Canada', 'Montreal': 'Canada',
            'Mexico City': 'Mexico', 'Cancun': 'Mexico',
            'Rio de Janeiro': 'Brazil', 'São Paulo': 'Brazil',
            'Buenos Aires': 'Argentina', 'Lima': 'Peru', 'Bogota': 'Colombia',
            'Santiago': 'Chile', 'Cairo': 'Egypt', 'Cape Town': 'South Africa',
            'Johannesburg': 'South Africa', 'Nairobi': 'Kenya', 'Lagos': 'Nigeria',
            'Casablanca': 'Morocco', 'Marrakech': 'Morocco',
            'Perth': 'Australia', 'Brisbane': 'Australia', 'Adelaide': 'Australia',
            'Bali': 'Indonesia', 'Phuket': 'Thailand', 'Hanoi': 'Vietnam',
            'Ho Chi Minh': 'Vietnam', 'Manila': 'Philippines', 'Jakarta': 'Indonesia',
            'Kuala Lumpur': 'Malaysia', 'Kathmandu': 'Nepal', 'Colombo': 'Sri Lanka',
            'Maldives': 'Maldives', 'Auckland': 'New Zealand', 'Wellington': 'New Zealand',
            'Queenstown': 'New Zealand'
        };
        
        // City coordinates (approximate lat/long for major cities)
        this.cityCoordinates = {
            'New York': [-74.0060, 40.7128],
            'Los Angeles': [-118.2437, 34.0522],
            'Chicago': [-87.6298, 41.8781],
            'San Francisco': [-122.4194, 37.7749],
            'Seattle': [-122.3321, 47.6062],
            'Boston': [-71.0589, 42.3601],
            'Miami': [-80.1918, 25.7617],
            'Las Vegas': [-115.1398, 36.1699],
            'Philadelphia': [-75.1652, 39.9526],
            'Dallas': [-96.7970, 32.7767],
            'London': [-0.1278, 51.5074],
            'Paris': [2.3522, 48.8566],
            'Rome': [12.4964, 41.9028],
            'Berlin': [13.4050, 52.5200],
            'Madrid': [-3.7038, 40.4168],
            'Amsterdam': [4.9041, 52.3676],
            'Barcelona': [2.1734, 41.3851],
            'Munich': [11.5820, 48.1351],
            'Tokyo': [139.6917, 35.6762],
            'Sydney': [151.2093, -33.8688],
            'Melbourne': [144.9631, -37.8136],
            'Bangkok': [100.5018, 13.7563],
            'Singapore': [103.8198, 1.3521],
            'Dubai': [55.2708, 25.2048],
            'Delhi': [77.1025, 28.7041],
            'New Delhi': [77.2090, 28.6139],
            'Mumbai': [72.8777, 19.0760],
            'Bengaluru': [77.5946, 12.9716],
            'Shanghai': [121.4737, 31.2304],
            'Beijing': [116.4074, 39.9042],
            'Hong Kong': [114.1694, 22.3193],
            'Seoul': [126.9780, 37.5665],
            'Istanbul': [28.9784, 41.0082],
            'Moscow': [37.6173, 55.7558],
            'Toronto': [-79.3832, 43.6532],
            'Vancouver': [-123.1207, 49.2827],
            'Montreal': [-73.5673, 45.5017],
            'Mexico City': [-99.1332, 19.4326],
            'Cancun': [-86.8515, 21.1619],
            'Rio de Janeiro': [-43.1729, -22.9068],
            'São Paulo': [-46.6333, -23.5505],
            'Buenos Aires': [-58.3816, -34.6037],
            'Lima': [-77.0428, -12.0464],
            'Bogota': [-74.0721, 4.7110],
            'Santiago': [-70.6693, -33.4489],
            'Cairo': [31.2357, 30.0444],
            'Cape Town': [18.4241, -33.9249],
            'Johannesburg': [28.0473, -26.2041],
            'Nairobi': [36.8219, -1.2921],
            'Lagos': [3.3792, 6.5244],
            'Casablanca': [-7.5898, 33.5731],
            'Marrakech': [-7.9811, 31.6295],
            'Zurich': [8.5417, 47.3769],
            'Geneva': [6.1432, 46.2044],
            'Vienna': [16.3738, 48.2082],
            'Prague': [14.4378, 50.0755],
            'Athens': [23.7275, 37.9838],
            'Lisbon': [-9.1393, 38.7223],
            'Porto': [-8.6291, 41.1579],
            'Edinburgh': [-3.1883, 55.9533],
            'Dublin': [-6.2603, 53.3498],
            'Copenhagen': [12.5683, 55.6761],
            'Stockholm': [18.0686, 59.3293],
            'Oslo': [10.7522, 59.9139],
            'Helsinki': [24.9384, 60.1699],
            'Warsaw': [21.0122, 52.2297],
            'Budapest': [19.0402, 47.4979],
            'Bali': [115.1889, -8.4095],
            'Phuket': [98.3923, 7.8804],
            'Hanoi': [105.8342, 21.0278],
            'Ho Chi Minh': [106.6297, 10.8231],
            'Manila': [120.9842, 14.5995],
            'Jakarta': [106.8456, -6.2088],
            'Kuala Lumpur': [101.6869, 3.1390],
            'Kathmandu': [85.3240, 27.7172],
            'Colombo': [79.8612, 6.9271],
            'Maldives': [73.2207, 3.2028],
            'Santorini': [25.4615, 36.3932],
            'Mykonos': [25.3289, 37.4467],
            'Venice': [12.3155, 45.4408],
            'Florence': [11.2558, 43.7696],
            'Milan': [9.1900, 45.4642],
            'Naples': [14.2681, 40.8518],
            'Brussels': [4.3517, 50.8503],
            'Bruges': [3.2247, 51.2093],
            'Reykjavik': [-21.8174, 64.1466],
            'Auckland': [174.7633, -36.8485],
            'Wellington': [174.7762, -41.2865],
            'Queenstown': [168.6626, -45.0312],
            'Perth': [115.8605, -31.9505],
            'Brisbane': [153.0251, -27.4698],
            'Adelaide': [138.6007, -34.9285],
            'Maui': [-156.3319, 20.7984],
            'Honolulu': [-157.8583, 21.3099],
            'Salt Lake City': [-111.8910, 40.7608],
            'Denver': [-104.9903, 39.7392],
            'Phoenix': [-112.0740, 33.4484],
            'Portland': [-122.6765, 45.5152],
            'Nashville': [-86.7816, 36.1627],
            'Austin': [-97.7431, 30.2672],
            'New Orleans': [-90.0715, 29.9511],
            'San Diego': [-117.1611, 32.7157],
            'Tampa': [-82.4572, 27.9506],
            'Orlando': [-81.3792, 28.5383],
            'Atlanta': [-84.3880, 33.7490],
            'Washington': [-77.0369, 38.9072],
            'LA': [-118.2437, 34.0522],
            'NYC': [-74.0060, 40.7128],
            'SF': [-122.4194, 37.7749]
        };
    }
    
    async render(container) {
        // Load CSV data directly
        const csvData = await this.loadCSV('data/cleaned_data.csv');
        
        if (!csvData || csvData.length === 0) {
            container.innerHTML = '<p style="color: #6b7280;">No data available</p>';
            return;
        }
        
        // Filter and process data: only rows with City and at least one accommodation type
        const accommodationData = [];
        
        csvData.forEach(row => {
            if (row.City && row.City.trim() !== '') {
                const cityValue = row.City.trim();
                const accommodations = [];
                
                // Check which accommodations are marked
                if (row.Hotel === 'y') accommodations.push('Hotel');
                if (row.Hostel === 'y') accommodations.push('Hostel');
                if (row.AirBnB === 'y') accommodations.push('AirBnB');
                if (row.Camping === 'y') accommodations.push('Camping');
                if (row.Villa === 'y') accommodations.push('Villa');
                
                // Only include if at least one accommodation type is present
                if (accommodations.length > 0) {
                    // Handle multiple cities in curly braces
                    if (cityValue.startsWith('{') && cityValue.endsWith('}')) {
                        const citiesString = cityValue.slice(1, -1);
                        const cities = citiesString.split(',').map(c => c.trim());
                        
                        cities.forEach(city => {
                            if (city !== '' && this.cityCoordinates[city]) {
                                accommodationData.push({
                                    city: city,
                                    coordinates: this.cityCoordinates[city],
                                    accommodations: [...accommodations]
                                });
                            }
                        });
                    } else {
                        // Single city
                        if (this.cityCoordinates[cityValue]) {
                            accommodationData.push({
                                city: cityValue,
                                coordinates: this.cityCoordinates[cityValue],
                                accommodations: accommodations
                            });
                        }
                    }
                }
            }
        });
        
        if (accommodationData.length === 0) {
            container.innerHTML = '<p style="color: #6b7280;">No accommodation data with coordinates available</p>';
            return;
        }
        
        // Group by city and aggregate accommodations
        const cityMap = new Map();
        accommodationData.forEach(item => {
            if (!cityMap.has(item.city)) {
                cityMap.set(item.city, {
                    city: item.city,
                    coordinates: item.coordinates,
                    accommodationCounts: {
                        'Hotel': 0,
                        'Hostel': 0,
                        'AirBnB': 0,
                        'Camping': 0,
                        'Villa': 0
                    }
                });
            }
            const cityData = cityMap.get(item.city);
            item.accommodations.forEach(acc => {
                cityData.accommodationCounts[acc]++;
            });
        });
        
        const processedData = Array.from(cityMap.values());
        
        // Create SVG
        const svg = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', '0 0 800 600')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('background', '#0a0a0a');
        
        const width = 800;
        const height = 600;
        
        // Add main group for zoom
        const g = svg.append('g');
        
        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 8])  // Allow zoom from 1x to 8x
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });
        
        svg.call(zoom);
        
        // Create projection (Mercator for world map)
        const projection = d3.geoMercator()
            .scale(130)
            .center([0, 30])
            .translate([width / 2, height / 2]);
        
        const path = d3.geoPath().projection(projection);
        
        // Create tooltip
        const tooltip = d3.select(container)
            .append('div')
            .style('position', 'absolute')
            .style('background', 'white')
            .style('border', '1px solid #e5e7eb')
            .style('border-radius', '6px')
            .style('padding', '10px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .style('box-shadow', '0 2px 8px rgba(0,0,0,0.15)')
            .style('z-index', '1000')
            .style('max-width', '200px');
        
        // Load and draw world map using TopoJSON
        try {
            const worldData = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
            const countries = topojson.feature(worldData, worldData.objects.countries);
            
            // Draw countries
            g.append('g')
                .selectAll('path')
                .data(countries.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('fill', '#1f2937')
                .attr('stroke', '#374151')
                .attr('stroke-width', 0.5);
            
            // Plot cities with accommodations
            this.plotCities(g, processedData, projection, tooltip, container);
            
            // Add legend (only in fullscreen mode)
            if (container.offsetWidth > 700) {
                this.addLegend(svg, width);
            }
            
            // Add description
            this.addDescription(container);
                
        } catch (error) {
            console.error('Error loading world map:', error);
            container.innerHTML = '<p style="color: #6b7280;">Error loading world map</p>';
        }
    }
    
    addDescription(container) {
        // Only show description in fullscreen mode, not in preview grid
        const isPreviewMode = container.id.includes('preview') || container.closest('.viz-preview');
        
        if (isPreviewMode) {
            return; // Don't add description in preview mode
        }
        
        // Create description element
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
        description.textContent = 'This visualization shows what type of accomodation is popular among people in different areas of the world. It reveals regional lodging trends.';
        
        // Append description to container
        container.appendChild(description);
    }

    plotCities(svg, processedData, projection, tooltip, container) {
        const colors = this.colors; // Store reference to colors
        const cityToCountry = this.cityToCountry; // Store reference to cityToCountry
        
        processedData.forEach((cityData, i) => {
            const [x, y] = projection(cityData.coordinates);
            
            // Calculate total accommodations for this city
            const total = Object.values(cityData.accommodationCounts).reduce((a, b) => a + b, 0);
            
            // Determine primary accommodation type (most common)
            let primaryType = 'Hotel';
            let maxCount = 0;
            Object.entries(cityData.accommodationCounts).forEach(([type, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    primaryType = type;
                }
            });
            
            // Get country name
            const country = cityToCountry[cityData.city] || 'Unknown';
            
            // Draw marker
            const markerSize = Math.sqrt(total) * 3 + 5; // Size based on total count
            
            svg.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 0)
                .attr('fill', colors[primaryType])
                .attr('stroke', 'none')
                .style('opacity', 0.8)
                .style('cursor', 'pointer')
                .on('mouseover', function(event) {
                    d3.select(this)
                        .style('opacity', 1)
                        .style('stroke', '#fbbf24')
                        .style('stroke-width', 2);
                    
                    // Remove any existing tooltips first
                    d3.selectAll('.map-tooltip').remove();
                    
                    // Build tooltip content with accommodation breakdown
                    let tooltipContent = `
                        <div style="margin-bottom: 6px;">
                            <strong style="color: #fbbf24; font-size: 13px;">${cityData.city}</strong>
                        </div>
                        <div style="color: #d1d5db; margin-bottom: 6px;">
                            <span style="color: #9ca3af;">Country:</span> ${country}
                        </div>
                        <div style="color: #d1d5db; margin-bottom: 6px;">
                            <span style="color: #9ca3af;">Primary Type:</span> ${primaryType}
                        </div>
                        <div style="color: #d1d5db; margin-bottom: 6px;">
                            <span style="color: #9ca3af;">Total Searches:</span> ${total}
                        </div>
                        <div style="border-top: 1px solid #374151; margin: 6px 0; padding-top: 6px;">
                            <div style="color: #9ca3af; font-size: 11px; margin-bottom: 4px;">Accommodation Breakdown:</div>
                    `;
                    
                    Object.entries(cityData.accommodationCounts).forEach(([type, count]) => {
                        if (count > 0) {
                            const color = colors[type];
                            tooltipContent += `
                                <div style="color: #d1d5db; font-size: 11px; margin-bottom: 2px;">
                                    <span style="display: inline-block; width: 8px; height: 8px; background: ${color}; border-radius: 50%; margin-right: 6px;"></span>
                                    ${type}: ${count}
                                </div>
                            `;
                        }
                    });
                    
                    tooltipContent += `</div>`;
                    
                    // Create tooltip
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
                        .html(tooltipContent)
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
                .delay(i * 50)
                .attr('r', markerSize);
        });
    }
    
    addLegend(svg, width) {
        // Add legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width - 160}, 50)`);
        
        legend.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('font-size', '13px')
            .attr('font-weight', '600')
            .attr('fill', '#9ca3af')
            .text('Accommodation Types');
        
        Object.entries(this.colors).forEach(([type, color], i) => {
            const legendRow = legend.append('g')
                .attr('transform', `translate(0, ${i * 22 + 20})`);
            
            legendRow.append('circle')
                .attr('cx', 7)
                .attr('cy', 0)
                .attr('r', 5)
                .attr('fill', color)
                .style('opacity', 0.8);
            
            legendRow.append('text')
                .attr('x', 18)
                .attr('y', 4)
                .attr('font-size', '11px')
                .attr('fill', '#9ca3af')
                .text(type);
        });
    }
    
    // CSV loading utility
    async loadCSV(filePath) {
        try {
            const response = await fetch(filePath);
            const text = await response.text();
            return this.parseCSV(text);
        } catch (error) {
            console.error('Error loading CSV:', error);
            return null;
        }
    }
    
    parseCSV(text) {
        const lines = text.split('\n');
        const headers = this.parseCSVLine(lines[0]).map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = this.parseCSVLine(lines[i]);
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });
            
            data.push(row);
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
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        
        return result;
    }
}
