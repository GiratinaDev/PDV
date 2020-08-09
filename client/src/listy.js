
var orderTheList = (data,loc,req) => {
    if (!data) return 'Error'
    const oldData = req
    var objKeys = {}
    for (var i = 0; i < oldData.length; i ++) {
        var x = oldData[i]
        if (objKeys[data[x][loc]]) objKeys[data[x][loc]].push(x)
        else objKeys[data[x][loc]] = [x]
    }
    const keys = Object.keys(objKeys)
    console.log(keys)
    if (loc === 'price' || loc === 'year') {
        keys.sort((a,b) => a - b)
    } else {
        keys.sort()
    }
    var send = []
    for (i = 0; i < keys.length; i++) {
        for (x = 0; x < objKeys[keys[i]].length; x++) {
            send.push(objKeys[keys[i]][x])
        }
    }
    return send
}

var findAllValues = (data,col) => {
    if (!data) return 'Error'
    const oldData = Object.keys(data)
    var objKeys = {}
    for (var i = 0; i < oldData.length; i ++) {
        var x = oldData[i]
        if (objKeys[data[x][col]]) objKeys[data[x][col]].push(x)
        else objKeys[data[x][col]] = [x]
    }
    const keys = Object.keys(objKeys)
    return keys
}

var filterColumn = (data,col,item,req) => {
    if (!data) return 'Error'
    const oldData = req
    var objKeys = {}
    for (var i = 0; i < oldData.length; i ++) {
        var x = oldData[i]
        if (objKeys[data[x][col]]) objKeys[data[x][col]].push(x)
        else objKeys[data[x][col]] = [x]
    }
    var send = objKeys[item]
    if(send) return send
    else {
        console.log('split')
        var temp = filterColumn(data,col,item,Object.keys(data))
        return req.concat(temp)
    }
}

var filterFilteredColumn = (data,cols,itemCols,req) => {
    if (!data) return 'Error'
    var send = req
    var store = {}
    console.log(cols)
    console.log(itemCols)
    const len = Object.keys(itemCols)
    console.log(len)
    for (var i = 0; i < len.length; i ++) {
        for (var x = 0; x < itemCols[len[i]].length; x++) {
            send = filterColumn(data,len[i],itemCols[len[i]][x],send)
        }
        store[len[i]] = send 
        console.log(store)
        send = req
    }
    send = compare(store)
    return send
}

var compare = (lists) => {
    if(!lists) return 'Error'
    var keys = Object.keys(lists)
    if(keys.length === 1) return lists[keys[0]]
    console.log('Link Start')
    console.log(lists)  
    console.log(keys)
    var send = lists[keys[0]]
    send.sort((a,b) => a - b)
    console.log(send)
    for (var c = 1; c < keys.length; c ++ ) {
        lists[keys[c]] = lists[keys[c]].sort((a, b) => a - b)
    }
    console.log(lists)
    for (var lc = 1; lc < keys.length; lc ++ ) {
        var first = 0
        var list = lists[keys[lc]]
        var temp = []
        for (var i = 0; i < send.length; i ++ ) {
            for (var x = first; x < list.length; x ++ ) {
                if (list[x] === send[i]) {
                    x = list.length
                    temp.push(send[i])
                }
            }
            if (temp.length !== 0) {
                first = list[temp[temp.length - 1]]
            }
        }
        send = temp
    }
    console.log(send)
    return send

}

var findName = (data,name) => {
    if (!data) return 'Error'
    const oldData = Object.keys(data)
    var objKeys = {}
    for (var i = 0; i < oldData.length; i ++) {
        var x = oldData[i]
        if (objKeys[data[x]['name']]) objKeys[data[x]['name']].push(x)
        else objKeys[data[x]['name']] = [x]
    }
    const keys = Object.keys(objKeys)
    const list = keys.join('-_-').toLowerCase().split('-_-')
    var send = []
    for (i = 0; i < list.length; i++ ) {
        if (list[i].search(name) !== -1) {
            var len = objKeys[keys[i]].length
            for (x = 0; x < len; x ++) {
                send.push(objKeys[keys[i]][x])
            }
        }
    }
    return send
}

//listy, do the export NAMEING
export { orderTheList, findAllValues, filterColumn, filterFilteredColumn, findName }