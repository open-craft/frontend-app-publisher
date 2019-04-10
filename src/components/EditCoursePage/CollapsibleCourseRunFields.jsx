import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { Collapsible } from '@edx/paragon';

import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import TranscriptLanguage from './TranscriptLanguage';
import StaffList from '../StaffList';
import ButtonToolbar from '../ButtonToolbar';
import FieldLabel from '../FieldLabel';

const formatCourseRunTitle = (courseRun) => {
  if (courseRun) {
    const labelItems = [];
    if (courseRun.start) {
      labelItems.push(moment(courseRun.start).format('MMM Do YYYY'));
    }
    if (courseRun.pacing_type) {
      labelItems.push(courseRun.pacing_type.split('_').map(pacingType =>
        pacingType.charAt(0).toUpperCase() + pacingType.slice(1)).join(' '));
    }
    return (
      <div className="course-run-label">
        <span>{`Course run starting on ${labelItems.join(' - ')}`}</span>
        <div className="course-run-studio-url">
          {'Studio URL - '}
          <a href={`${process.env.STUDIO_BASE_URL}/course/${courseRun.key}`}>
            {`${courseRun.key}`}
          </a>
        </div>
        {courseRun.marketing_url ?
          <div className="course-run-preview-url">
            {'Preview URL - '}
            <a href={`${courseRun.marketing_url}`}>
              {'View about page'}
            </a>
          </div> : null}
      </div>
    );
  }
  return (
    <div>
      <span>Your new course run</span>
    </div>
  );
};

const getDateString = date => (date ? moment(date).format('YYYY-MM-DD') : '');

const CollapsibleCourseRunFields = ({
  fields,
  courseRuns,
  languageOptions,
  pacingTypeOptions,
}) => (
  <div>
    {fields.map((courseRun, index) => (
      <Collapsible
        title={formatCourseRunTitle(courseRuns[index])}
        key={`collapsible-run-${courseRun}`}
        iconId={`collapsible-icon-${courseRun}`}
      >
        <Field
          name={`${courseRun}.start`}
          type="date"
          component={RenderInputTextField}
          format={value => getDateString(value)}
          label={<FieldLabel text="Start date" required />}
          placeholder="mm/dd/yyyy"
          required
        />
        <Field
          name={`${courseRun}.end`}
          type="date"
          component={RenderInputTextField}
          format={value => getDateString(value)}
          normalize={value => moment(value).toISOString()}
          label={<FieldLabel text="End date" required />}
          placeholder="mm/dd/yyyy"
          required
        />
        <Field
          name={`${courseRun}.min_effort`}
          type="number"
          component={RenderInputTextField}
          label={<FieldLabel text="Minimum effort" />}
        />
        <Field
          name={`${courseRun}.max_effort`}
          type="number"
          component={RenderInputTextField}
          label={<FieldLabel text="Maximum effort" />}
        />
        <Field
          name={`${courseRun}.pacing_type`}
          type="text"
          component={RenderSelectField}
          options={pacingTypeOptions}
          label={<FieldLabel text="Course pacing" />}
        />
        <Field
          name={`${courseRun}.content_language`}
          type="text"
          component={RenderSelectField}
          options={languageOptions}
          label={<FieldLabel text="Content language" />}
        />
        <FieldLabel text="Transcript languages" className="mb-2" />
        <FieldArray
          name={`${courseRun}.transcript_languages`}
          component={TranscriptLanguage}
          languageOptions={languageOptions}
        />
        <Field
          name={`${courseRun}.weeks_to_complete`}
          type="number"
          component={RenderInputTextField}
          label={<FieldLabel text="Length" />}
        />
        <FieldLabel text="Staff" className="mb-2" />
        <Field
          name={`${courseRun}.staff`}
          component={StaffList}
        />
        <ButtonToolbar>
          <button
            type="submit"
            className="btn btn-primary form-submit-btn"
          >
            {courseRun.status === 'published' ? (
              <span>Publish</span>
            ) : (
              <span>Submit for Review</span>
            )}
          </button>
        </ButtonToolbar>
      </Collapsible>
    ))}
  </div>
);

CollapsibleCourseRunFields.propTypes = {
  fields: PropTypes.shape({
    remove: PropTypes.func,
  }).isRequired,
  languageOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  pacingTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  courseRuns: PropTypes.arrayOf(PropTypes.shape({})),
};

CollapsibleCourseRunFields.defaultProps = {
  courseRuns: [],
};

export default CollapsibleCourseRunFields;