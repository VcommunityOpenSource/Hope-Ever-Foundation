// ==========================================
// Interactive Tamil Nadu District Map
// Using local TamilNadu.geojson
// ==========================================

const TARGET_DISTRICTS = [
    "Chennai", "Kancheepuram", "Thiruvallur", "Tiruvannamalai",
    "Cuddalore", "Tiruchchirappalli", "Dindigul", "Villupuram",
    "Ariyalur", "Pudukkottai", "Sivaganga", "Namakkal", "Kanniyakumari"
];

const CHIP_TO_GEO = {
    "Chennai": "Chennai",
    "Kanchipuram": "Kancheepuram",
    "Thiruvallur": "Thiruvallur",
    "Thiruvannamalai": "Tiruvannamalai",
    "Cuddalore": "Cuddalore",
    "Trichy": "Tiruchchirappalli",
    "Dindigul": "Dindigul",
    "Villupuram": "Villupuram",
    "Ariyalur": "Ariyalur",
    "Pondicherry": null,   // Union Territory (Not in standard TN GeoJSON)
    "Pudhukottai": "Pudukkottai",
    "Sivagangai": "Sivaganga",
    "Namakkal": "Namakkal",
    "Kanyakumari": "Kanniyakumari"
};

// Reverse mapping for display names
const GEO_TO_CHIP = Object.fromEntries(
    Object.entries(CHIP_TO_GEO).filter(([_, geo]) => geo !== null).map(([chip, geo]) => [geo, chip])
);

function isTargetDistrict(districtName) {
    return TARGET_DISTRICTS.includes(districtName);
}

let globalTooltip = null;

function initD3Map(containerId) {
    const container = d3.select(`#${containerId}`);
    if (container.empty()) return;

    // Clear any existing SVG to prevent duplicates if function runs twice
    container.selectAll("svg").remove();

    const width = 210, height = 290;
    
    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .style("max-width", "300px")
        .style("display", "block")
        .style("margin", "0 auto")
        .style("overflow", "visible"); // Prevents clipping borders

    // Map Projection Settings
    const projection = d3.geoMercator()
        .center([79.3, 10.8]) // Adjusted to perfectly center Tamil Nadu
        .scale(2300)
        .translate([width / 2, height / 2]);

    const geoPath = d3.geoPath().projection(projection);

    // Initialize global tooltip only once
    if (!globalTooltip) {
        globalTooltip = d3.select("body")
            .append("div")
            .attr("class", "d3-map-tooltip")
            .style("position", "absolute")
            .style("background", "#0f6e56")
            .style("color", "#fff")
            .style("padding", "6px 12px")
            .style("border-radius", "6px")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("z-index", "1000")
            .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
            .style("transition", "opacity 0.2s ease-in-out");
    }

    d3.json("assets/data/TamilNadu.geojson")
        .then(data => {
            svg.selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("class", "district-path")
                .attr("d", geoPath)
                .attr("data-district", d => d.properties.NAME_2)
                .style("fill", d => isTargetDistrict(d.properties.NAME_2) ? "#c8e6dc" : "#f0f0f0")
                .style("stroke", "#0f6e56")
                .style("stroke-width", "0.8px")
                .style("cursor", d => isTargetDistrict(d.properties.NAME_2) ? "pointer" : "default")
                .style("transition", "fill 0.3s ease") 
                .on("mouseover", function(event, d) {
                    const geoName = d.properties.NAME_2;
                    if (!isTargetDistrict(geoName)) return;
                    
                    const displayName = GEO_TO_CHIP[geoName] || geoName;
                    d3.select(this).style("fill", "#a8d5c4"); // Hover highlight
                    
                    globalTooltip.style("opacity", 1)
                           .html(`<strong>${displayName}</strong>`)
                           .style("left", `${event.pageX + 12}px`)
                           .style("top", `${event.pageY - 28}px`);
                })
                .on("mousemove", function(event) {
                    globalTooltip.style("left", `${event.pageX + 12}px`)
                           .style("top", `${event.pageY - 28}px`);
                })
                .on("mouseout", function(event, d) {
                    const geoName = d.properties.NAME_2;
                    if (isTargetDistrict(geoName)) {
                        // Keep orange if it was clicked via chip, otherwise revert to light green
                        const isActive = d3.select(this).classed("active-highlight");
                        d3.select(this).style("fill", isActive ? "#d4872a" : "#c8e6dc");
                    }
                    globalTooltip.style("opacity", 0);
                })
                .on("click", function(event, d) {
                    const geoName = d.properties.NAME_2;
                    if (!isTargetDistrict(geoName)) return;
                    
                    const chipName = GEO_TO_CHIP[geoName] || geoName;
                    const matchingChip = Array.from(document.querySelectorAll('.district-list .chip'))
                        .find(chip => chip.getAttribute('data-name') === chipName);
                    
                    if (matchingChip) matchingChip.click();
                });

            // IMPORTANT: Initialize chips strictly AFTER the map is successfully drawn
            initChips(svg);
        })
        .catch(error => {
            console.error("Error loading GeoJSON:", error);
            container.html('<p style="color:#888;font-size:0.85rem;text-align:center;padding-top:2rem;">⚠️ Could not load district map. Check file path: assets/data/TamilNadu.geojson</p>');
        });
}

function initChips(svg) {
    const chips = document.querySelectorAll('.district-list .chip');
    if (!chips.length) return;

    // Remove old event listeners to prevent double-firing
    const chipsClone = Array.from(chips).map(chip => {
        const clone = chip.cloneNode(true);
        chip.parentNode.replaceChild(clone, chip);
        return clone;
    });

    chipsClone.forEach(chip => {
        chip.addEventListener('click', () => {
            const chipName = chip.dataset.name;
            const geoName = CHIP_TO_GEO[chipName];
            
            // Handle Pondicherry visually without annoying alerts
            if (chipName === "Pondicherry" || !geoName) {
                const originalText = chip.innerText;
                chip.classList.add('active');
                chip.innerText = "Union Territory";
                chip.style.backgroundColor = "#d4872a";
                chip.style.color = "#fff";
                
                setTimeout(() => {
                    chip.classList.remove('active');
                    chip.innerText = originalText;
                    chip.style.backgroundColor = "";
                    chip.style.color = "";
                }, 1500);
                return;
            }

            // Remove active class from sibling chips
            const parentLayout = chip.closest('.map-layout');
            if (parentLayout) {
                parentLayout.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            }
            chip.classList.add('active');

            // Reset all map highlights first
            svg.selectAll('.district-path').each(function(d) {
                if (isTargetDistrict(d.properties.NAME_2)) {
                    d3.select(this)
                      .classed("active-highlight", false)
                      .style("fill", "#c8e6dc");
                }
            });

            // Target the specific district clicked
            const targetDistrict = svg.selectAll('.district-path')
                .filter(d => d.properties.NAME_2 === geoName);

            if (!targetDistrict.empty()) {
                targetDistrict
                    .classed("active-highlight", true)
                    .style("fill", "#d4872a");

                // Calculate map district center so tooltip appears over the map, not the list
                const pathNode = targetDistrict.node();
                const bbox = pathNode.getBoundingClientRect(); 
                const centerX = bbox.left + (bbox.width / 2) + window.scrollX;
                const centerY = bbox.top + (bbox.height / 2) + window.scrollY;

                const displayName = GEO_TO_CHIP[geoName] || geoName;
                
                if (globalTooltip) {
                    globalTooltip.style("opacity", 1)
                           .html(`<strong>${displayName}</strong>`)
                           .style("left", `${centerX}px`)
                           .style("top", `${centerY - 20}px`);
                    
                    setTimeout(() => { globalTooltip.style("opacity", 0); }, 1500);
                }

                // Reset state after 1.5s
                setTimeout(() => {
                    targetDistrict
                        .classed("active-highlight", false)
                        .style("fill", "#c8e6dc");
                    chip.classList.remove('active');
                }, 1500);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if the container exists before initializing
    if (document.getElementById('tn-map-svg')) {
        initD3Map('tn-map-svg');
    }
    if (document.getElementById('tn-map-svg-contact')) {
        initD3Map('tn-map-svg-contact');
    }
});