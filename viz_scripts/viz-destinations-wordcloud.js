/**
 * Destinations Word Cloud
 * Shows cities sized by frequency of appearance in the travel data
 */
class DestinationsWordCloud {
    constructor() {
        this.width = 1000;
        this.height = 600;
        this.padding = 20;
        
        // Color palette for word cloud (red/orange/yellow theme)
        this.colors = [
            '#ef4444', '#dc2626', '#f97316', '#ea580c', '#fbbf24',
            '#f59e0b', '#fb923c', '#fdba74', '#fed7aa', '#fde68a',
            '#b91c1c', '#c2410c', '#d97706', '#ca8a04', '#eab308'
        ];
    }

    async render(container) {
        try {
            // Load CSV data
            const csvData = await this.loadCSV('../data/cleaned_data.csv');
            
            // Process data to count city frequencies
            const cityData = this.processCityData(csvData);
            
            if (cityData.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 50px;">No city data available</p>';
                return;
            }
            
            // Clear container
            container.innerHTML = '';
            
            // Get container dimensions
            const containerRect = container.getBoundingClientRect();
            const width = containerRect.width || this.width;
            const height = containerRect.height || this.height;
            
            // Create SVG that fills the container
            const svg = d3.select(container)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', `0 0 ${width} ${height}`)
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .style('background', '#000000');
            
            // Create main group centered
            const mainGroup = svg.append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`);
            
            // Calculate font sizes based on frequency
            const maxCount = d3.max(cityData, d => d.count);
            const minCount = d3.min(cityData, d => d.count);
            
            // Font size scale (adjusted for container size)
            const fontSizeScale = d3.scaleLinear()
                .domain([minCount, maxCount])
                .range([Math.min(width, height) * 0.02, Math.min(width, height) * 0.12]);
            
            // Prepare words with sizes
            const words = cityData.map((d, i) => ({
                text: d.city,
                size: fontSizeScale(d.count),
                count: d.count,
                color: this.colors[i % this.colors.length]
            }));
            
            // Sort by size (largest first for better layout)
            words.sort((a, b) => b.size - a.size);
            
            // Create word cloud layout
            this.layoutWords(mainGroup, words);
            
            // Add description below the visualization
            this.addDescription(container);
            
        } catch (error) {
            console.error('Error rendering Word Cloud:', error);
            container.innerHTML = `<p style="color: red; text-align: center; padding: 50px;">Error loading visualization: ${error.message}</p>`;
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
        description.textContent = 'This visualization shows the relative popularity of travel destinations based on how frequently they appear in the data. Cities that occur more often are displayed with larger text. This makes highly popular destinations stand out immediately. It provides a quick overview of overall destination trends.';
        
        container.appendChild(description);
    }

    processCityData(csvData) {
        const cityCountMap = new Map();
        
        // Count city occurrences
        csvData.forEach(row => {
            if (row.City && row.City.trim() !== '') {
                const cityValue = row.City.trim();
                
                // Handle curly braces format: {city1, city2, city3}
                if (cityValue.startsWith('{') && cityValue.endsWith('}')) {
                    const cities = cityValue
                        .slice(1, -1)
                        .split(',')
                        .map(c => c.trim())
                        .filter(c => c !== '');
                    
                    cities.forEach(city => {
                        cityCountMap.set(city, (cityCountMap.get(city) || 0) + 1);
                    });
                } else {
                    cityCountMap.set(cityValue, (cityCountMap.get(cityValue) || 0) + 1);
                }
            }
        });
        
        // Convert to array and sort by count
        const cityData = Array.from(cityCountMap.entries())
            .map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count);
        
        return cityData;
    }

    layoutWords(group, words) {
        const maxAttempts = 1000;
        const placedWords = [];
        
        words.forEach((word, index) => {
            let placed = false;
            let attempts = 0;
            
            // Try to place the word
            while (!placed && attempts < maxAttempts) {
                // For first word, place at center
                if (index === 0) {
                    word.x = 0;
                    word.y = 0;
                    placed = true;
                } else {
                    // Spiral placement algorithm
                    const angle = attempts * 0.5;
                    const radius = attempts * 3;
                    word.x = radius * Math.cos(angle);
                    word.y = radius * Math.sin(angle);
                    
                    // Check collision with existing words
                    if (!this.hasCollision(word, placedWords)) {
                        placed = true;
                    }
                }
                
                attempts++;
            }
            
            if (placed) {
                placedWords.push(word);
            }
        });
        
        // Render placed words
        const wordElements = group.selectAll('.word')
            .data(placedWords)
            .enter()
            .append('g')
            .attr('class', 'word')
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this).select('text')
                    .transition()
                    .duration(200)
                    .style('font-size', `${d.size * 1.15}px`)
                    .style('font-weight', '700');
                
                // Show tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'wordcloud-tooltip')
                    .style('position', 'absolute')
                    .style('background', 'rgba(0, 0, 0, 0.85)')
                    .style('color', 'white')
                    .style('padding', '10px 14px')
                    .style('border-radius', '6px')
                    .style('font-size', '14px')
                    .style('pointer-events', 'none')
                    .style('z-index', '1000')
                    .style('box-shadow', '0 4px 6px rgba(0,0,0,0.2)')
                    .html(`
                        <strong>${d.text}</strong><br/>
                        <span style="color: #a3e635;">Mentions: ${d.count}</span>
                    `)
                    .style('left', (event.pageX + 15) + 'px')
                    .style('top', (event.pageY - 15) + 'px');
            })
            .on('mouseout', function(event, d) {
                d3.select(this).select('text')
                    .transition()
                    .duration(200)
                    .style('font-size', `${d.size}px`)
                    .style('font-weight', '600');
                
                d3.selectAll('.wordcloud-tooltip').remove();
            });
        
        // Add text elements
        wordElements.append('text')
            .text(d => d.text)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('font-size', d => `${d.size}px`)
            .style('font-weight', '600')
            .style('fill', d => d.color)
            .style('font-family', 'Poppins, Inter, sans-serif')
            .style('text-shadow', '0 2px 4px rgba(0,0,0,0.15)')
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 50)
            .style('opacity', 1);
    }

    hasCollision(newWord, placedWords) {
        // Estimate word bounding box
        const newBox = this.getWordBox(newWord);
        
        // Check collision with all placed words
        for (const word of placedWords) {
            const box = this.getWordBox(word);
            
            // Check if boxes overlap
            if (!(newBox.right < box.left ||
                  newBox.left > box.right ||
                  newBox.bottom < box.top ||
                  newBox.top > box.bottom)) {
                return true; // Collision detected
            }
        }
        
        return false;
    }

    getWordBox(word) {
        // Approximate word dimensions
        // Average character width is about 0.6 * font size
        const width = word.text.length * word.size * 0.6;
        const height = word.size * 1.2;
        const padding = 5;
        
        return {
            left: word.x - width / 2 - padding,
            right: word.x + width / 2 + padding,
            top: word.y - height / 2 - padding,
            bottom: word.y + height / 2 + padding
        };
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
