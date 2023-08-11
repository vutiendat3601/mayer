/* eslint-disable import/no-anonymous-default-export */

import { faCalendarCheck, faComment } from '@fortawesome/free-solid-svg-icons';

import Profile1 from "../../../assets/img/profile-cover.jpg"
import Profile2 from "../../../assets/img/profile-cover.jpg"
import Profile3 from "../../../assets/img/profile-cover.jpg"
import Profile4 from "../../../assets/img/profile-cover.jpg"

export default [
    {
        "id": 1,
        "image": Profile1,
        "name": "Christopher Wood",
        "statusKey": "online",
        "icon": faCalendarCheck,
        "btnText": "Invite"
    },
    {
        "id": 2,
        "image": Profile2,
        "name": "Jose Leos",
        "statusKey": "inMeeting",
        "icon": faComment,
        "btnText": "Message"
    },
    {
        "id": 3,
        "image": Profile3,
        "name": "Bonnie Green",
        "statusKey": "offline",
        "icon": faCalendarCheck,
        "btnText": "Invite"
    },
    {
        "id": 4,
        "image": Profile4,
        "name": "Neil Sims",
        "statusKey": "online",
        "icon": faComment,
        "btnText": "Message"
    }
]