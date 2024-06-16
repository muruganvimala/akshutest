import { ChartOptions } from "./sellers.model"

// Seller-1 chart
const seller1Chart: ChartOptions = {
    series: [{
        data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14],
    }],
    chart: {
        type: "area",
        height: 43,
        sparkline: {
            enabled: true,
        },
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
        },
    },
    stroke: {
        curve: "smooth",
        width: 2,
    },
    colors: ["#ff6c6c"],
    tooltip: {
        fixed: {
            enabled: false,
        },
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return "";
                },
            },
        },
        marker: {
            show: false,
        },
    }
};

// Seller-2 chart
const seller2Chart: ChartOptions = {
    series: [{
        data: [12, 14, 2, 47, 42, 15, 35, 75, 20, 67, 89],
    },],
    chart: {
        type: "area",
        height: 43,
        sparkline: {
            enabled: true,
        },
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
        },
    },
    stroke: {
        curve: "smooth",
        width: 2,
    },
    colors: ["#2dcb73"],
    tooltip: {
        fixed: {
            enabled: false,
        },
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return "";
                },
            },
        },
        marker: {
            show: false,
        },
    },
};

// Seller-3 chart
const seller3Chart: ChartOptions = {
    series: [{
        data: [45, 20, 8, 42, 30, 5, 35, 79, 22, 54, 64],
    },],
    chart: {
        type: "area",
        height: 43,
        sparkline: {
            enabled: true,
        },
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
        },
    },
    stroke: {
        curve: "smooth",
        width: 2,
    },
    colors: ["#2dcb73"],
    tooltip: {
        fixed: {
            enabled: false,
        },
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return "";
                },
            },
        },
        marker: {
            show: false,
        },
    },
};

// Seller-4 chart
const seller4Chart: ChartOptions = {
    series: [{
        data: [26, 15, 48, 12, 47, 19, 35, 19, 85, 68, 50],
    },],
    chart: {
        type: "area",
        height: 43,
        sparkline: {
            enabled: true,
        },
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
        },
    },
    stroke: {
        curve: "smooth",
        width: 2,
    },
    colors: ["#2dcb73"],
    tooltip: {
        fixed: {
            enabled: false,
        },
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return "";
                },
            },
        },
        marker: {
            show: false,
        },
    },
};

// Seller-5 chart
const seller5Chart: ChartOptions = {
    series: [{
        data: [60, 67, 12, 49, 6, 78, 63, 51, 33, 8, 16],
    },],
    chart: {
        type: "area",
        height: 43,
        sparkline: {
            enabled: true,
        },
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
        },
    },
    stroke: {
        curve: "smooth",
        width: 2,
    },
    colors: ["#ff6c6c"],
    tooltip: {
        fixed: {
            enabled: false,
        },
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return "";
                },
            },
        },
        marker: {
            show: false,
        },
    },
};

// Seller-6 chart
const seller6Chart: ChartOptions = {
    series: [{
        data: [78, 63, 51, 33, 8, 16, 60, 67, 12, 49,],
    },],
    chart: {
        type: "area",
        height: 43,
        sparkline: {
            enabled: true,
        },
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
        },
    },
    stroke: {
        curve: "smooth",
        width: 2,
    },
    colors: ["#2dcb73"],
    tooltip: {
        fixed: {
            enabled: false,
        },
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return "";
                },
            },
        },
        marker: {
            show: false,
        },
    },
};

// Seller-7 chart
const seller7Chart: ChartOptions = {
    series: [{
        data: [15, 35, 75, 20, 67, 8, 42, 30, 5, 35],
    },],
    chart: {
        type: "area",
        height: 43,
        sparkline: {
            enabled: true,
        },
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
        },
    },
    stroke: {
        curve: "smooth",
        width: 2,
    },
    colors: ["#2dcb73"],
    tooltip: {
        fixed: {
            enabled: false,
        },
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return "";
                },
            },
        },
        marker: {
            show: false,
        },
    },
};

// Seller-8 chart
const seller8Chart: ChartOptions = {
    series: [{
        data: [45, 32, 68, 55, 36, 10, 48, 25, 74, 54],
    },],
    chart: {
        type: "area",
        height: 43,
        sparkline: {
            enabled: true,
        },
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
        },
    },
    stroke: {
        curve: "smooth",
        width: 2,
    },
    // colors: ["--tb-danger"],
    tooltip: {
        fixed: {
            enabled: false,
        },
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return "";
                },
            },
        },
        marker: {
            show: false,
        },
    },
};

const sellerList = [
    {
        id: 1,
        img: "assets/images/companies/img-7.png",
        name: "Pich Hub",
        seller: "Lenna Labadie",
        email: "lennalabadie@dayrep.com",
        phone: "+(253) 12345 67890",
        stock: "451",
        revenue: "$253.32",
        chart: seller1Chart
    },
    {
        id: 2,
        img: "assets/images/companies/img-5.png",
        name: "Jorce Medicines",
        seller: "Dallin Schowalter",
        email: "dallinschowalter@rhyta.com",
        phone: "+(152) 32165 49873",
        stock: "1163",
        revenue: "$992.14",
        chart: seller2Chart
    },
    {
        id: 3,
        img: "assets/images/companies/img-2.png",
        name: "Rotic Fashion",
        seller: "Alvina Smitham",
        email: "alvinasmitham@dayrep.com",
        phone: "+(231) 14562 32165",
        stock: "1023",
        revenue: "$954.08",
        chart: seller3Chart
    },
    {
        id: 4,
        img: "assets/images/companies/img-6.png",
        name: "Terry & Jerry",
        seller: "Dallin Schowalter",
        email: "dallinschowalter@jourrapide.com",
        phone: "+(44) 98765 32104",
        stock: "357",
        revenue: "$346.35",
        chart: seller4Chart
    },
    {
        id: 5,
        img: "assets/images/companies/img-3.png",
        name: "Themesbrand",
        seller: "Kenyon Nienow",
        email: "kenyonnienow@dayrep.com",
        phone: "+(251) 25874 13690",
        stock: "841",
        revenue: "$654.78",
        chart: seller5Chart
    },
    {
        id: 6,
        img: "assets/images/companies/img-2.png",
        name: "Brand Infosys",
        seller: "Alexandrea Jacobi",
        email: "alexandreajacobi@jourrapide.com",
        phone: "+(92) 67890 12345",
        stock: "395",
        revenue: "$153.84",
        chart: seller6Chart
    },
    {
        id: 7,
        img: "assets/images/companies/img-7.png",
        name: "Pich Fashion",
        seller: "Jaylon McClure",
        email: "jaylonmcclure@armyspy.com",
        phone: "+(62) 35791 15935",
        stock: "792",
        revenue: "$357.44",
        chart: seller7Chart
    },
    {
        id: 8,
        img: "assets/images/companies/img-1.png",
        name: "Zibra Fashion",
        seller: "Lenna Labadie",
        email: "lennalabadie@dayrep.com",
        phone: "+(120) 15935 32165",
        stock: "451",
        revenue: "$253.32",
        chart: seller8Chart
    }
]

export { sellerList , seller1Chart}