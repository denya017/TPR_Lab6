fillingOptions('inputNumberOfAlternatives', 3, 10);
fillingOptions('inputNumberOfVariants', 3, 10);

let numberOfVariants;
let numberOfAlternatives;
let votingTable = [];

function fillingOptions(tagId, min, max) {
    for (let i = min; i <= max; i++) {
        let optionTag = document.createElement('option');
        optionTag.setAttribute('value', i.toString());
        optionTag.innerHTML = i.toString();
        document.getElementById(tagId).append(optionTag);
    }
    document.getElementById(tagId).selectedIndex = 0;
}

function getSelectedIndex(tagId) {
    return document.getElementById(tagId).selectedIndex;
}

function getValue(tagId) {
    let selectedOptionIndex = getSelectedIndex(tagId);
    return document.getElementById(tagId).options[selectedOptionIndex].value;
}

function first() {
    document.getElementById('first').innerHTML = '';
    document.getElementById('second').innerHTML = '';
    numberOfVariants = parseInt(getValue('inputNumberOfVariants'));
    numberOfAlternatives = parseInt(getValue('inputNumberOfAlternatives'))

    const table = document.createElement("table");
    table.id = 'firstTable';
    table.className = "table table-hover";
    const p = document.createElement('p');
    p.innerHTML = 'Заполните профиль голосования';
    document.getElementById('first').append(p);
    document.getElementById('first').append(table);
    let thead = document.createElement("thead");
    table.append(thead);
    let tR = document.createElement("tr");
    thead.append(tR);

    for (let i = 0; i < numberOfVariants; i++) {
        let th = document.createElement("th");
        th.scope = "col";
        tR.append(th);
        const input = document.createElement('input');
        input.min = '0';
        input.max = numberOfAlternatives;
        input.type = 'number';
        th.append(input);
    }

    let tbody = document.createElement("tbody");
    table.append(tbody);

    for (let i = 0; i < numberOfAlternatives; i++) {
        let tr = document.createElement("tr");
        tbody.append(tr);
        for (let j = 0; j < numberOfVariants; j++) {
            let td = document.createElement("td");
            let select = document.createElement('select');
            select.className = 'form-select w-auto';
            select.id = 'selectTable' + i + j;
            td.append(select);
            tr.append(td);
            fillingOptions(select.id, 1, numberOfAlternatives);
        }

    }

    let btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.type = 'button';
    btn.innerHTML = 'Далее';
    btn.onclick = second;
    document.getElementById('first').append(btn);
}

function second() {
    document.getElementById('second').innerHTML = '';

    votingTable[0] = [];
    for (let i = 0; i < numberOfVariants; i++) {
        votingTable[0][i] = parseInt(document.getElementById('firstTable').getElementsByTagName('thead')[0].getElementsByTagName('th')[i].getElementsByTagName('input')[0].value);
    }

    for (let i = 0; i < numberOfAlternatives; i++) {
        votingTable[i + 1] = [];
        for (let j = 0; j < numberOfVariants; j++) {
            votingTable[i + 1][j] = parseInt(getValue('selectTable' + i + j));
        }
    }

    let result = {};
    for (let i = 0; i < votingTable[0].length; i++) {
        let value = votingTable[1][i];
        if (result.hasOwnProperty(value)) {
            result[value] += votingTable[0][i];
        } else {
            result[value] = votingTable[0][i];
        }
    }
    let sortable = [];
    for (let vehicle in result) {
        sortable.push([vehicle, result[vehicle]]);
    }
    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });

    const p = document.createElement('p');
    p.innerHTML = ` Результат по правилу относительного большинства (по правилу первого тура): <br>`;
    for (let i = 0; i < sortable.length; i++) {
        if (i !== 0) {
            p.innerHTML += ' , ';
        }
        p.innerHTML += 'Альтернатива ' + sortable[i][0] + ' получила ' + sortable[i][1] + ' голосов'
    }

    p.innerHTML += '. Победила ' + sortable[0][0] + ' альтернатива!';

    document.getElementById('second').append(p);


    const p2 = document.createElement('p');
    p2.innerHTML = ` Результат по правилу абсолютного большинства (по правилу второго тура): <br>`;
    for (let i = 0; i < votingTable[0].length; i++) {
        if (parseInt(sortable[0][0]) === votingTable[1][i] ||
            parseInt(sortable[1][0]) === votingTable[1][i]) {
        } else {
            for (let j = 1; j < votingTable.length; j++) {
                if (parseInt(sortable[0][0]) === votingTable[j][i]) {
                    sortable[0][1] += votingTable[0][i];
                    break;
                } else if (parseInt(sortable[1][0]) === votingTable[j][i]) {
                    sortable[1][1] += votingTable[0][i];
                    break;
                }
            }
        }
    }
    p2.innerHTML += 'Альтернатива ' + sortable[0][0] + ' получила ' + sortable[0][1] + ' голосов, альтернатива ' + sortable[1][0] + ' получила ' + sortable[1][1] + ' голосов.';
    if (sortable[0][1] > sortable[1][1]) {
        p2.innerHTML += ' Победила ' + sortable[0][0] + ' альтернатива!';
    } else if (sortable[1][1] > sortable[0][1]) {
        p2.innerHTML += ' Победила ' + sortable[1][0] + ' альтернатива!';
    } else {
        p2.innerHTML += ' Ничья!';
    }

    document.getElementById('second').append(p2);

    const p3 = document.createElement('p');
    p3.innerHTML = ` Результаты по правилу Борда: <br>`;
    let thirdMethod = [];
    for (let i = 0; i < numberOfAlternatives; i++) {
        thirdMethod[i] = 0;
    }
    for (let i = 1; i < votingTable.length; i++) {
        for (let j = 0; j < votingTable[i].length; j++) {
            let value = votingTable[i][j];
            thirdMethod[value - 1] += votingTable[0][j] * (votingTable.length - 1 - i);
        }
    }
    let maxValue = 0;
    for (let i = 0; i < thirdMethod.length; i++) {
        if (i !== 0) {
            p3.innerHTML += ' , ';
            if (thirdMethod[i] > thirdMethod[maxValue])
                maxValue = i;
        }
        p3.innerHTML += 'Альтернатива ' + (i + 1) + ' получила ' + thirdMethod[i] + ' баллов'
    }

    p3.innerHTML += '. Победила ' + (maxValue + 1) + ' альтернатива!';

    document.getElementById('second').append(p3);


    const p4 = document.createElement('p');
    p4.innerHTML = ` Результаты по правилу Кондорсе (по правилу первого тура):<br>`;

    let fourthMethod = [];
    for (let i = 0; i < numberOfAlternatives; i++) {
        fourthMethod[i] = 0;
    }
    for (let k = 0; k < numberOfAlternatives; k++) {
        for (let l = k + 1; l < numberOfAlternatives; l++) {
            let firstValue = 0;
            let secondValue = 0;
            for (let i = 0; i < votingTable[0].length; i++) {
                if (k + 1 === votingTable[1][i]) {
                    firstValue += votingTable[0][i];
                } else if (l + 1 === votingTable[1][i]) {
                    secondValue += votingTable[0][i];
                } else {
                    for (let j = 1; j < votingTable.length; j++) {
                        if (k + 1 === votingTable[j][i]) {
                            firstValue += votingTable[0][i];
                            break;
                        } else if (l + 1 === votingTable[j][i]) {
                            secondValue += votingTable[0][i];
                            break;
                        }
                    }
                }
            }
            p4.innerHTML += 'При сравнении альтернатив ' + (k + 1) + ' и ' + (l + 1) + ' победила альтернатива ';

            if (firstValue > secondValue) {
                fourthMethod[k]++;
                p4.innerHTML += (k + 1) + '.<br>';
            } else if (firstValue < secondValue) {
                fourthMethod[l]++;
                p4.innerHTML += (l + 1) + '.<br>';
            } else {
                p4.innerHTML += 'дружба!<br>';
            }

        }
    }
    maxValue = 0;
    for (let i = 1; i < numberOfAlternatives; i++) {
        if (fourthMethod[i] > fourthMethod[maxValue])
            maxValue = i;
    }
    p4.innerHTML += 'Победила '+(maxValue+1)+' альтернатива!';
    document.getElementById('second').append(p4);
}

