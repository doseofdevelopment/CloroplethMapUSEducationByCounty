const educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
const countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

// Canvas setup
let svg = d3.select('#canvas')
let width = 1200
let height = 600
let padding = 60
svg.attr('width', width)
svg.attr('height', height)

//Promise for Data
d3.json(countyURL).then(
    (data, error) => {
        if (error) {
            console.log(log)
        } else {
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        educationData = data;
                        console.log(educationData)
                        //Create tooltip to display selected bar values
                        let tooltip = d3.select('body')
                            .append('div')
                            .attr('id', 'tooltip')
                            .style('visibility', 'hidden')
                            .style('width', 'auto')
                            .style('height', 'auto')

                        svg.selectAll('path')
                            .data(countyData)
                            .enter()
                            .append('path')
                            .attr('d', d3.geoPath())
                            .attr('class', 'county')
                            .attr('fill', (d) => {
                                let id = d.id
                                let county = educationData.find((d) => {
                                    return d.fips === id
                                }
                                )
                                let percentage = county.bachelorsOrHigher
                                if (percentage <= 15) {
                                    return 'red'
                                } else if (percentage <= 30) {
                                    return 'orange'
                                } else if (percentage <= 45) {
                                    return 'lightgreen'
                                } else {
                                    return 'green'
                                }
                            })
                            .attr('data-fips', (d) => {
                                return d.id
                            })
                            .attr('data-education', (d) => {
                                let id = d.id
                                let county = educationData.find((d) => {
                                    return d.fips === id
                                })
                                return county.bachelorsOrHigher
                            })

                            //Code for tooltip updating 
                            .on('mouseover', (d) => {

                                tooltip.transition()
                                    .style('visibility', 'visible')
                                    .style('left', d3.event.pageX + 10 + 'px')
                                    .style('top', d3.event.pageY - 60 + 'px')
                                    .style('background-color', '#caf0f8')
                                let id = d.id
                                let county = educationData.find((d) => {
                                    return d.fips === id
                                })
                                tooltip.html('FIPS # ' + county.fips + '<br> ' + county.area_name + ', ' + county.state + ' <br> <strong>' + county.bachelorsOrHigher + '</strong>%')

                                document.querySelector('#tooltip').setAttribute('data-education', county.bachelorsOrHigher)
                            })
                            .on('mouseout', (d) => {
                                tooltip.transition()
                                    .style('visibility', 'hidden')
                            })
                    }

                }
            )
        }
    }
)