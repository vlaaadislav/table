Vue.component('grid', {

    template: '#grid-template',

    props: {
        data: Array,
        columns: Array,
        conditions: Array
    },

    data() {
        var sortOrders = {};

        this.columns.forEach(function (key) {
            sortOrders[key] = 1;
        });

        return {
            sortKey: '',
            sortOrders: sortOrders
        };
    },

    computed: {
        filteredData() {
            var sortKey = this.sortKey;
            var order = this.sortOrders[sortKey] || 1;
            var data = this.data;

            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey];
                    b = b[sortKey];
                    return (a === b ? 0 : a > b ? 1 : -1) * order;
                });
            }

            return data;
        }
    },

    methods: {
        sortBy(key) {
            this.sortKey = key;
            this.sortOrders[key] = this.sortOrders[key] * -1;
        },

        isTrueCond(col, row) {
            for (expr of this.conditions) {
                if (expr[0] === col) {
                    return this.checkOneCond(expr, row);
                }
            }
        },

        checkOneCond(expr, row) {
            var parser = new _e.Parser({
                operators: {
                    concatenate: false,
                    logical: true,
                    comparison: true
                }
            });

            var expr = parser.parse(expr);

            return expr.evaluate(row);
        }
    }
});

Vue.component('cond-item', {
    template: `
        <li>
            {{ title }}
            <button @click="$emit('remove')">Удалить</button>
        </li>
    `,

    props: ['title']
});


var table = getGridData();
var columns = Object.keys(table[0]);

var app = new Vue({
    el: '#app',

    data: {
        condQuery: '',
        conditions: [],
        gridColumns: columns,
        gridData: table
    },

    methods: {
        addNewCond() {
            if (! this.condQuery) return;
            this.conditions.push(this.condQuery);
            this.condQuery = '';
        },

        removeCond(index) {
            this.conditions.splice(index, 1);
        }
    }
});


function getGridData() {
    var rowsQty = getRandomInt();
    var columnsQty = getRandomInt();
    var table = [];

    for (let row = 0; row < rowsQty; row++) {
        var tableRow = {};
        for (let col = 0; col < columnsQty; col++) {
            tableRow[String.fromCharCode(65 + col)] = getRandomInt(-100, 100);
        }
        table.push(tableRow);
    }

    return table;
}

function getRandomInt(min = 9, max = 26) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

