import React, {PropTypes} from 'react';
import {DashModal} from 'universal/components/Dashboard';
import withStyles from 'universal/styles/withStyles';
import {css} from 'aphrodite-local-styles/no-important';
import Button from 'universal/components/Button/Button';
import Type from 'universal/components/Type/Type';
import {cashay} from 'cashay';
import portal from 'react-portal-hoc';
import {reduxForm, Field, SubmissionError} from 'redux-form';
import TextAreaField from 'universal/components/TextAreaField/TextAreaField';
import rejectOrgApprovalValidation from './rejectOrgApprovalValidation';
import shouldValidate from 'universal/validation/shouldValidate';
import appTheme from 'universal/styles/theme/appTheme';

const validate = (values) => {
  const schema = rejectOrgApprovalValidation();
  return schema(values).errors;
};

const RejectOrgApprovalModal = (props) => {
  const {
    closeAfter,
    closePortal,
    error,
    handleSubmit,
    isClosing,
    notificationId,
    inviteeEmail,
    inviterName,
    submitting,
    styles
  } = props;
  const onSubmit = async(submissionData) => {
    const schema = rejectOrgApprovalValidation();
    const {data: {reason}} = schema(submissionData);
    const variables = {reason, notificationId};
    const {error} = await cashay.mutate('rejectOrgApproval', {variables});
    if (error) throw SubmissionError(error);
    closePortal();
  };
  return (
    <DashModal closeAfter={closeAfter} closePortal={closePortal} isClosing={isClosing} onBackdropClick={closePortal}>
      <Type align="center" bold marginBottom="1.5rem" scale="s7" colorPalette="cool">
        Care to say why?
      </Type>
      <Type align="center" bold scale="s4">
        Type a response below <br />
        and we'll pass it along to {inviterName} <br />
      </Type>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <div className={css(styles.error)}>{error}</div>}
        <Field
          component={TextAreaField}
          name="reason"
        />
        <div className={css(styles.buttonBlock)}>
          <Button
            colorPalette="cool"
            disabled={submitting}
            isBlock
            label={`Reject ${inviteeEmail}`}
            size="small"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </DashModal>
  );
};

RejectOrgApprovalModal.propTypes = {
  orgId: PropTypes.string.isRequired,
  preferredName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
};

const styleThunk = () => ({
  buttonBlock: {
    marginTop: '1rem'
  },

  error: {
    color: appTheme.palette.warm,
    fontWeight: 700,
    textAlign: 'center'
  },
});

export default portal({escToClose: true, closeAfter: 100})(
  reduxForm({form: 'rejectOrgApproval', validate, shouldValidate})(
    withStyles(styleThunk)(RejectOrgApprovalModal)
  )
);