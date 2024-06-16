import { ChartOptions } from "./widgets.model"

// Other-1 chart
const SessionChart: ChartOptions = {
    series: [{
        name: 'Total Sessions',
        data: [31, 40, 28, 51, 42, 109, 103]
    }],
    chart: {
        height: 114,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        show: false,
        yaxis: {
            lines: {
                show: false
            }
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    colors: ['#3762ea', '#1e1a22'],
    xaxis: {
        categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        labels: {
            style: {
                fontSize: '10px',
            },
        }
    },
    yaxis: {
        show: false,
    },
};

const DurationChart: ChartOptions = {
    series: [{
        name: 'Avg. Visit Duration',
        data: [29, 43, 71, 58, 99, 93, 130]
    }],
    chart: {
        height: 124,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        show: false,
        yaxis: {
            lines: {
                show: false
            }
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    colors: ['#3762ea', '#1e1a22'],
    xaxis: {
        categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        labels: {
            style: {
                fontSize: '10px',
            },
        }
    },
    yaxis: {
        show: false,
    },
};

const ImpressionChart: ChartOptions = {
    series: [{
        name: 'Impressions',
        data: [50, 18, 47, 32, 84, 110, 93]
    }],
    chart: {
        height: 124,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        show: false,
        yaxis: {
            lines: {
                show: false
            }
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    colors: ["#1e1a22"],
    xaxis: {
        categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        labels: {
            style: {
                fontSize: '10px',
            },
        }
    },
    yaxis: {
        show: false,
    },
};

const ViewChart: ChartOptions = {
    series: [{
        name: 'Total Views',
        data: [72, 58, 30, 51, 42, 95, 119]
    }],
    chart: {
        height: 124,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        show: false,
        yaxis: {
            lines: {
                show: false
            }
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    colors: ["#3762ea"],
    xaxis: {
        categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        labels: {
            style: {
                fontSize: '10px',
            },
        }
    },
    yaxis: {
        show: false,
    },
};




const widget = [
    {
        id: 1,
        label: "Total Sessions",
        labelClass: "muted",
        percentage: "06.41%",
        percentageClass: "success",
        percentageIcon: "bi bi-arrow-up",
        counter: 368.24,
        caption: "Last Month",
        iconClass: "success",
        suffix: "k",
        chart: SessionChart
    },
    {
        id: 2,
        label: "Avg. Visit Duration",
        labelClass: "muted",
        percentage: "13%",
        percentageClass: "success",
        percentageIcon: "bi bi-arrow-up",
        counter: 1.47,
        caption: "Last Month",
        iconClass: "success",
        suffix: "sec",
        chart: DurationChart
    },
    {
        id: 3,
        label: "Impressions",
        labelClass: "muted",
        percentage: "07.26%",
        percentageClass: "danger",
        percentageIcon: "bi bi-arrow-up",
        counter: 1647,
        caption: "Last Week",
        iconClass: "danger",
        suffix: "",
        chart: ImpressionChart
    },
    {
        id: 4,
        label: "Total Views",
        labelClass: "muted",
        percentage: "13%",
        percentageClass: "success",
        percentageIcon: "bi bi-arrow-up",
        counter: 291.32,
        caption: "Last Month",
        iconClass: "success",
        suffix: "k",
        chart: ViewChart
    },
]

const widget2 = [
    {
        id: 1,
        label: "Total Tickets",
        icon: "bi bi-ticket",
        percentage: "+3.47 %",
        caption: "than last week",
        counters: 249,
        badge: "ri-arrow-right-up-line",
        suffix: "k",
        iconbg: "bg-success-subtle text-success",
        prefix: "",
        bgColor: "",
        textcolor: "text-muted",
        color: "success"
    },
    {
        id: 2,
        label: "Pending Tickets",
        icon: "bi bi-hourglass-split",
        percentage: " +6.33 %",
        caption: "than last week",
        counters: 3174,
        badge: "ri-arrow-right-down-line",
        suffix: "k",
        iconbg: "bg-warning-subtle text-warning ",
        prefix: "",
        textcolor: "text-muted",
        color: "danger"
    },
    {
        id: 3,
        label: "Closed Tickets",
        icon: "bi bi-lock",
        percentage: "+7.34 %",
        caption: "than last week",
        counters: 1596,
        badge: "ri-arrow-right-up-line",
        suffix: "k",
        iconbg: "bg-danger-subtle text-danger ",
        prefix: "",
        bgColor: "",
        textcolor: "text-muted",
        color: "success"
    },
    {
        id: 4,
        label: "New Tickets",
        icon: "bi bi-ticket",
        percentage: "+1.29 %",
        caption: "than last week",
        counters: 365,
        badge: "ri-arrow-right-up-line",
        suffix: "k",
        prefix: "",
        iconbg: "bg-primary-subtle text-primary",
        bgColor: "card-primary",
        textcolor: "text-white text-opacity-50",
        color: "danger"
    }
]



const browserData = [
    {
        id: '1',
        img: 'assets/images/brands/chrome.png',
        browsers: 'Google Chrome',
        click: '640',
        rate: '86.01%'
    },
    {
        id: '2',
        img: 'assets/images/brands/firefox.png',
        browsers: 'Firefox',
        click: '274',
        rate: '59.22%'
    },
    {
        id: '3',
        img: 'assets/images/brands/safari.png',
        browsers: 'Safari',
        click: '591',
        rate: '71.36%'
    },
    {
        id: '4',
        img: 'assets/images/brands/opera.png',
        browsers: 'Opera',
        click: '456',
        rate: '63.82%'
    },
    {
        id: '5',
        img: 'assets/images/brands/microsoft.png',
        browsers: 'Microsoft Edge',
        click: '312',
        rate: '57.48%'
    },
    {
        id: '6',
        img: 'assets/images/brands/microsoft2.png',
        browsers: 'Internet Explorer',
        click: '164',
        rate: '77.21%'
    },
    {
        id: '7',
        img: 'assets/images/brands/chromium.png',
        browsers: 'Chromium',
        click: '36',
        rate: '18.90%'
    }
]
const rentproperty = [
    {
        id: '1',
        img: 'assets/images/real-estate/img-01.jpg',
        name: 'Liberty Property',
        bedroom: '1',
        bathroom: '1',
        sqft: '958',
        rate: '4.3'
    },
    {
        id: '2',
        img: 'assets/images/real-estate/img-02.jpg',
        name: 'Duplex Square Valley',
        bedroom: '3',
        bathroom: '2',
        sqft: '2659',
        rate: '3.8'
    },
    {
        id: '3',
        img: 'assets/images/real-estate/img-03.jpg',
        name: "Small house on an autumn’s",
        bedroom: '2',
        bathroom: '1',
        sqft: '2230',
        rate: '4.3'
    },
    {
        id: '4',
        img: 'assets/images/real-estate/img-07.jpg',
        name: 'New Grand Hotel Room',
        bedroom: '3',
        bathroom: '2',
        sqft: '2785',
        rate: '4.9'
    },
    {
        id: '5',
        img: 'assets/images/real-estate/img-08.jpg',
        name: 'Park Side Colonial',
        bedroom: '5',
        bathroom: '3',
        sqft: '5643',
        rate: '4.7'
    },
    {
        id: '6',
        img: 'assets/images/real-estate/img-07.jpg',
        name: 'Whitespace Vintage Villa',
        bedroom: '4',
        bathroom: '2',
        sqft: '1145',
        rate: '4.9'
    },
    {
        id: '7',
        img: 'assets/images/real-estate/img-05.jpg',
        name: 'Nightlight Residency',
        bedroom: '2',
        bathroom: '1',
        sqft: '1324',
        rate: '4.9'
    }
]


const saleproperty = [
    {
        id: '1',
        img: 'assets/images/real-estate/img-08.jpg',
        name: 'Crystal House',
        bedroom: '2',
        bathroom: '1',
        sqft: '1039',
        rate: '4.5'
    },
    {
        id: '2',
        img: 'assets/images/real-estate/img-07.jpg',
        name: 'Whitespace Vintage Villa',
        bedroom: '4',
        bathroom: '2',
        sqft: '1145',
        rate: '4.9'
    },
    {
        id: '3',
        img: 'assets/images/real-estate/img-05.jpg',
        name: 'Northlight Residency',
        bedroom: '3',
        bathroom: '3',
        sqft: '1859',
        rate: '4.7'
    },
    {
        id: '4',
        img: 'assets/images/real-estate/img-08.jpg',
        name: 'Park Side Colonial',
        bedroom: '5',
        bathroom: '3',
        sqft: '5643',
        rate: '4.7'
    },
    {
        id: '5',
        img: 'assets/images/real-estate/img-04.jpg',
        name: 'Marina Hill Vintage',
        bedroom: '4',
        bathroom: '3',
        sqft: '1963',
        rate: '4.8'
    },
    {
        id: '6',
        img: 'assets/images/real-estate/img-07.jpg',
        name: 'Grand Cub Hotel',
        bedroom: '3',
        bathroom: '1',
        sqft: '1543',
        rate: '4.4'
    }
  
]

export { widget, widget2, browserData, rentproperty, saleproperty }