import React, { SyntheticEvent } from "react";
import { Grid, List } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import { ActivityForm } from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  selectedActivity: IActivity;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (activity: IActivity | null) => void;
  createActivity: (activity: IActivity) => void;
  editActivity: (acitivy: IActivity) => void;
  deleteActivity: (e: SyntheticEvent<HTMLButtonElement>,id: string) => void;
  submitting: boolean;
  target: string;
}

const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectActivity,
  selectedActivity,
  editMode,
  setEditMode,
  setSelectedActivity,
  createActivity,
  editActivity,
  deleteActivity,
  submitting,
  target
}) => {
  // Cleaner WAY, access directly the prop that will be used
  //const ActivityDashboard: React.FC<IProps> = (props) => { -- ONE WAY TO DO
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
          submitting={submitting}
          target={target}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {/* If selectedActivity is not null and EditMode is false then run this code: */}
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
          />
        )}
        {editMode && (
          <ActivityForm
            key={selectedActivity && (selectedActivity.id || 0)} // give a key so react know that activity has changed
            setEditMode={setEditMode}
            activity={selectedActivity!}
            createActivity={createActivity}
            editActivity={editActivity}
            submitting={submitting}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
