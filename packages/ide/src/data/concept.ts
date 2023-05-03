
export const OtherUser = {
    name: 'OtherUser',
    description: '其他用户，使用 id 来区别。',
    code: `function otherUser({ user }, { system }, userToMatch) {
    return user.id !== userToMatch.id
}`
}

export const NewFriendRequests = {
    name: 'NewFriendRequests',
    description: '所有的新好友请求：其他用户发情的还有请求，在同一活动中没有被当前用户拒绝过、同意过，也没有被发起者取消过。',
    code: `function allNewRequests({ user }, { system}) {
    return (Array.from(system.stack.stackHistory.values()) as Event[]).filter(({action, payload}: Event) => (
        action === 'sendFriendRequest' && payload.to.id === user.id
    ))
}`
}

export const AllFriends = {
    name: 'AllFriends',
    description: '所有好友：给我发起过好友请求，并且我同意了的用户，或者我发起过好友请求，同意了我的请求的用户。',
    code: () => `function allFriends({ user }, { system }) {
    const friends: User[] = []

    for (let activityEvent of system.stack.activityStack.values()) {
        if (
            activityEvent.sendInteraction?.payload?.to?.id === user.id
            && activityEvent.responseGroup?.approveInteraction
        ){    
            friends.push(activityEvent.sendInteraction.user)    
        }
    }
    
    for (let activityEvent of system.stack.activityStack.values()) {
        if (
            activityEvent.sendInteraction?.user.id === user.id
            && activityEvent.responseGroup?.approveInteraction
        ) {
            friends.push(activityEvent.sendInteraction.payload.to)
        }
    }

    return friends
}`
}

export const User = {
    type: 'entity',
    name: 'User',
    description: '系统中的默认用户类型',
    properties: [{
        name: 'name',
        type: 'text'
    }, {
        name: 'age',
        type: 'number'
    }, {
        name: 'email',
        type: 'email'
    }, {
        name: 'mobile phone',
        type: 'phone_number'
    }]
}

export const Message = {
    type: 'entity',
    name: 'Message',
    description: '通用消息类型',
    properties: [{
        name: 'content',
        type: 'text'
    }]
}

