// see constants.js where most variables are defined

let MAP;  // the Highcharts.mapChart object


function init () {
    initMap();
}


function initMap () {
    // load Highcharts state data and make some adjustments
    // remove DC, and pixel-fuss a couple of state labels
    var mapdata = Highcharts.geojson(Highcharts.maps['countries/us/us-all']);
    mapdata = mapdata.filter(function (state) {
    	return state.name != 'District of Columbia';
    });
    [
        { name: "Texas", xfuss: -0.35, yfuss: +0.20 },
        { name: "Oklahoma", xfuss: +0.15, yfuss: +0.40 },
        { name: "Kansas", xfuss: +0.05, yfuss: +0.40 },
        { name: "Georgia", xfuss: -0.30, yfuss: -0.40 },
        { name: "Wisconsin", xfuss: -0.50, yfuss: +0.10 },
    ].forEach(function (statelabelpixelfuss) {
        var state = mapdata.filter(function (state) { return state.name == statelabelpixelfuss.name; })[0];
        if (! state) throw new Error("Pixel fussing did not find state " + statelabelpixelfuss.name);

        var path = state.path;
        var copy = { path: path };

        Highcharts.seriesTypes.map.prototype.getBox.call({}, [copy]);
        state.middleX = ((path[0][1] + path[1][1]) / 2 - copy._minX) / (copy._maxX - copy._minX) + statelabelpixelfuss.xfuss;
        state.middleY = ((path[0][2] + path[2][2]) / 2 - copy._minY) / (copy._maxY - copy._minY) + statelabelpixelfuss.yfuss;
    });

    // prepare the series data: a datum entry is a {} object with the state's .name
    const dataseries_completed = STATES_COMPLETED.map(function (name) { return { name: name }; });
    const dataseries_inprogress = STATES_INPROGRESS.map(function (name) { return { name: name }; });
    const dataseries_notanalyzed = STATES_NOTANALYZED.map(function (name) { return { name: name }; });

    // set up the map and go
    const mapchartoptions = {
        chart: {
            map: mapdata,
            animation: false,  // recommended, because it can get glitchy as we change data or resize screen
        },
        title: false,
        legend: {
            enabled: true
        },
        plotOptions: {
            map: {
                allAreas: false,  // do not use allAreas: true, use a No Data series instead; known buggy, draws over top of real data, covers colors and absorbs events
                nullColor: 'transparent',
                joinBy: ['name'],
                dataLabels: {
                    enabled: true,
                    style: STATE_LABEL_STYLE,
                    formatter: function () {
                        const seriesid = this.point.series.userOptions.id;
                        if (seriesid == 'notanalyzed') return '';  // nodata = no label

                        return this.point.properties.name;
                        // return this.point.properties['postal-code'];
                    },
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{point.name}'
                },
            },
            series: {
                events: {
                    legendItemClick: function(e) { e.preventDefault(); }, // click legend = disables those states/series = ugly
                    click: function (event) {
                        const seriesid = event.point.series.userOptions.id;
                        if (seriesid == 'notanalyzed') return;
                        if (seriesid == 'inprogress') return;

                        const abbrv = event.point.properties['postal-code'];
                        const url = `https://${abbrv}.cidsitingtool.org/`.toLowerCase();
                        window.open(url, `cidstate-${abbrv}`);
                    },
                },
            },
        },
        series: [
            { name: 'Completed', id: 'completed', color: FILLCOLOR_COMPLETED, borderColor: BORDERCOLOR, showInLegend: true, data: dataseries_completed },
            { name: 'Coming Soon', id: 'inprogress', color: FILLCOLOR_INPROGRESS, borderColor: BORDERCOLOR, showInLegend: true, data: dataseries_inprogress },
            { name: 'Not Analyzed', id: 'notanalyzed', color: FILLCOLOR_NOTANALYZED, borderColor: BORDERCOLOR, showInLegend: false, data: dataseries_notanalyzed },
    	],
    };

    MAP = Highcharts.mapChart('nationalmap', mapchartoptions);
}
