import React, {PropTypes} from 'react';
import Button from 'universal/components/Button/Button';
import CallOutPanel from 'universal/components/CallOutPanel/CallOutPanel';
import makeDateString from 'universal/utils/makeDateString';
import CreditCardModal from 'universal/modules/userDashboard/components/CreditCardModal/CreditCardModal';

const ExpiredTrialCallOut = (props) => {
  const {orgId, validUntil} = props;
  const trialEnd = makeDateString(validUntil, false);
  const button = <Button colorPalette="cool" label="Add Billing Information"/>;
  const control = <CreditCardModal orgId={orgId} toggle={button}/>;
  return (
    <CallOutPanel control={control} heading={'Your trial expired!'}>
      <span>Your 30-day trial expired on <b>{trialEnd}</b>. Add your <br />credit card to continue using Action with your teams.</span>
    </CallOutPanel>
  );
};


ExpiredTrialCallOut.propTypes = {
  orgId: PropTypes.string.isRequired,
  validUntil: PropTypes.instanceOf(Date)
};

export default ExpiredTrialCallOut;