const host = 'http://localhost'

function makeApi(name: string, endpoint: string, body: any = {}) {
    return {
        "name": name,
        "request": {
            "method": "POST",
            "header": [
                {
                    "key": "Content-Type",
                    "value": "application/json",
                    "type": "text"
                }
            ],
            "body": {
                "mode": "raw",
                "raw": JSON.stringify(body)
            },
            "url": {
                "raw": `${host}${endpoint}`,
                "protocol": "http",
                "host": [
                    "localhost"
                ],
                "port": "8000",
                "path": endpoint.slice(1).split('/')
            }
        },
        "response": []
    }
}


export default {
    "info": {
        "name": "Peer",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    "item": [
        makeApi('peer/friendRequest/createActivity', '/peer/friendRequest/createActivity', { argv: {user: {id: ''}} }),
        makeApi('peer/friendRequest/sendFriendRequest', '/peer/friendRequest/sendFriendRequest', {
            activityId: '',
            argv: {
                user: {id: ''},
                payload: {to: {id: ''}, message: {content: ''}}
            }
        }),
        makeApi('peer/friendRequest/approve', '/peer/friendRequest/approve', { argv: {user: {id: ''}}, activityId: ''}),
        makeApi('peer/friendRequest/reject', '/peer/friendRequest/reject', { argv: {user: {id: ''}}, activityId: ''}),
        makeApi('peer/friendRequest/cancel', '/peer/friendRequest/cancel', { argv: {user: {id: ''}}, activityId: ''}),
        makeApi('peer/get/newFriendRequests', '/peer/get/newFriendRequests', { argv: {user: {id: ''}}}),
        makeApi('peer/get/allFriends', '/peer/get/allFriends', { argv: {user: {id: ''}}}),
    ]
}
