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

const DISTRICT_INTERVENTIONS = {
    "Chennai": "Herbal sanitary napkin awareness and livelihood initiative; healthcare and BFSI skill training; women livelihood and entrepreneurship support programs.",
    "Kanchipuram": "Millet cultivation and processing training; organic farming awareness; value-added food production training; SHG-based entrepreneurship initiatives.",
    "Thiruvallur": "Old-age welfare support initiatives; COVID relief distribution programs; WASH and community awareness campaigns; school support and educational material distribution.",
    "Thiruvannamalai": "Handicraft development and artisan training; robotics and technical skill training at educational institutions; tribal handicraft awareness programs; Jawadhu Hills education support activities.",
    "Cuddalore": "Organic farming and sustainable agriculture promotion; value-added food processing training; community livelihood enhancement activities.",
    "Trichy": "Agricultural Training Center and Livestock Development Program; farmer training in water conservation, fodder cultivation, and livestock management; participatory rural development activities.",
    "Dindigul": "Women SHG strengthening; leadership and financial literacy programs; women livelihood and entrepreneurship development initiatives.",
    "Villupuram": "SBDEP entrepreneurship and vocational skill training programs in Gingee and Senji regions; PMKVY skill development activities; youth employability support.",
    "Ariyalur": "Educational scholarship support for women students; rural women empowerment and livelihood enhancement activities.",
    "Pondicherry": "Youth employability and vocational skill development programs; retail, healthcare, and IT-enabled services training initiatives.",
    "Pudhukottai": "Micro-skill entrepreneurship development; tailoring, mehendi, beautician, and agarbatti-based home livelihood programs; women-focused enterprise support.",
    "Sivagangai": "Entrepreneurship and livelihood skill development programs; SHG strengthening; youth enterprise and financial literacy training.",
    "Namakkal": "Solar and renewable-energy livelihood promotion; solar lantern distribution; green skill and sustainability awareness activities.",
    "Kanyakumari": "Child rights awareness initiatives; youth leadership and advocacy programs; village-level welfare and community participation activities."
};

let districtTimer = null;
let districtTimerInterval = null;

function initChips(svg) {
    const chips = document.querySelectorAll('.district-list .chip');
    if (!chips.length) return;

    // Remove old event listeners to prevent double-firing
    const chipsClone = Array.from(chips).map(chip => {
        const clone = chip.cloneNode(true);
        chip.parentNode.replaceChild(clone, chip);
        return clone;
    });

    const detailsBox = document.getElementById('district-details-box');
    const detailsTitle = document.getElementById('details-district-title');
    const detailsText = document.getElementById('details-district-text');
    const progressBar = document.getElementById('details-progress-bar');
    const timerLabel = document.getElementById('details-timer-label');

    chipsClone.forEach(chip => {
        chip.addEventListener('click', () => {
            const chipName = chip.dataset.name;
            const geoName = CHIP_TO_GEO[chipName];
            
            // Clear any active 10s timer
            if (districtTimer) {
                clearTimeout(districtTimer);
                districtTimer = null;
            }
            if (districtTimerInterval) {
                clearInterval(districtTimerInterval);
                districtTimerInterval = null;
            }

            // Pondicherry visual and detail behavior without standard geo JSON map paths
            if (chipName === "Pondicherry") {
                if (detailsBox) {
                    detailsBox.style.display = 'block';
                    detailsTitle.innerText = "Pondicherry (Union Territory)";
                    detailsText.innerText = DISTRICT_INTERVENTIONS["Pondicherry"];
                    
                    progressBar.classList.remove('countdown-active');
                    void progressBar.offsetWidth; // Trigger reflow to restart CSS animation
                    progressBar.classList.add('countdown-active');
                }

                const parentLayout = chip.closest('.map-layout');
                if (parentLayout) {
                    parentLayout.querySelectorAll('.chip').forEach(c => {
                        c.classList.remove('active');
                        c.style.backgroundColor = "";
                        c.style.color = "";
                    });
                }
                chip.classList.add('active');
                chip.style.backgroundColor = "#d4872a";
                chip.style.color = "#fff";

                // Reset all map highlights
                svg.selectAll('.district-path').each(function(d) {
                    if (isTargetDistrict(d.properties.NAME_2)) {
                        d3.select(this)
                          .classed("active-highlight", false)
                          .style("fill", "#c8e6dc");
                    }
                });

                let secondsLeft = 10;
                if (timerLabel) timerLabel.innerText = `Active for ${secondsLeft}s`;

                districtTimerInterval = setInterval(() => {
                    secondsLeft--;
                    if (timerLabel) {
                        timerLabel.innerText = secondsLeft > 0 ? `Active for ${secondsLeft}s` : `Active for 10s`;
                    }
                }, 1000);

                districtTimer = setTimeout(() => {
                    chip.classList.remove('active');
                    chip.style.backgroundColor = "";
                    chip.style.color = "";
                    if (detailsBox) detailsBox.style.display = 'none';
                    if (districtTimerInterval) clearInterval(districtTimerInterval);
                }, 10000);

                return;
            }

            // Remove active class and colors from sibling chips
            const parentLayout = chip.closest('.map-layout');
            if (parentLayout) {
                parentLayout.querySelectorAll('.chip').forEach(c => {
                    c.classList.remove('active');
                    c.style.backgroundColor = "";
                    c.style.color = "";
                });
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

                // Calculate map district center so tooltip appears over the map
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

                // Show the interventions detail box with 10s countdown
                if (detailsBox) {
                    detailsBox.style.display = 'block';
                    detailsTitle.innerText = chipName === "Kanchipuram" ? "Kanchipuram / Chengalpattu" : chipName;
                    detailsText.innerText = DISTRICT_INTERVENTIONS[chipName] || "Interventions data to be loaded.";
                    
                    progressBar.classList.remove('countdown-active');
                    void progressBar.offsetWidth; // Trigger reflow to restart CSS animation
                    progressBar.classList.add('countdown-active');
                }

                let secondsLeft = 10;
                if (timerLabel) timerLabel.innerText = `Active for ${secondsLeft}s`;

                districtTimerInterval = setInterval(() => {
                    secondsLeft--;
                    if (timerLabel) {
                        timerLabel.innerText = secondsLeft > 0 ? `Active for ${secondsLeft}s` : `Active for 10s`;
                    }
                }, 1000);

                // Set 10 seconds timeout to hide details box and reset highlights
                districtTimer = setTimeout(() => {
                    targetDistrict
                        .classed("active-highlight", false)
                        .style("fill", "#c8e6dc");
                    chip.classList.remove('active');
                    if (detailsBox) detailsBox.style.display = 'none';
                    if (districtTimerInterval) clearInterval(districtTimerInterval);
                }, 10000);
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