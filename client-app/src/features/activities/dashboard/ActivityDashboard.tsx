import { observer } from "mobx-react-lite";
import React from "react";
import { Grid } from "semantic-ui-react";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";
import ActivityStore from "../../../app/stores/activityStore";
import { useContext } from "react";

const ActivityDashboard: React.FC = () => {
  // Cleaner WAY, access directly the prop that will be used
  //const ActivityDashboard: React.FC<IProps> = (props) => { -- ONE WAY TO DO, passing props and use props.Activitiy
  const activityStore = useContext(ActivityStore);
  const { editMode, selectedActivity } = activityStore;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        {/* If selectedActivity is not null and EditMode is false then run this code: */}
        {selectedActivity && !editMode && <ActivityDetails />}
        {editMode && (
          <ActivityForm
            key={selectedActivity && (selectedActivity.id || 0)} // give a key so react know that activity has changed
            activity={selectedActivity!}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
