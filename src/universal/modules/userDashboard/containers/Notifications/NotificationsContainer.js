import React, {Component, PropTypes} from 'react';
import {TRIAL_EXPIRES_SOON, APPROVE_TO_ORG} from 'universal/utils/constants';
import Notification from 'universal/modules/userDashboard/components/Notification/Notification';

// const notificationsQuery = `
// query {
//   notifications(userId: $userId) @live {
//     id
//
//   }
// }`;
//
// const mapStateToProps = (state) => {
//   const {user} = cashay.query(notificationsQuery, {
//     op: 'notificationsContainer',
//   }).data;
//   return {
//     user
//   }
// };

const notifications = [
  {
    type: TRIAL_EXPIRES_SOON,
    varList: [
      new Date(),
      'org123'
    ]
  }
];

export default class NotificationsContainer extends Component {
  render() {
    return (
      <div>
        Notifications: {notifications.map((notification) =>
          <Notification
            key={`notification${notification}`}
            type={notification.type}
            varList={notification.varList}
          />
      )}
      </div>
    );
  }
}