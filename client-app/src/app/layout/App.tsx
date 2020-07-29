import React, { useEffect, Fragment, useContext } from "react";
import { Container } from "semantic-ui-react";

import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

import LoadingComponent from "../layout/LoadingComponent";
import ActivityStore from "../stores/activityStore";
import { observer } from "mobx-react-lite";

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
    // dependency array uses external property that our inside function depends one
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading Activities..." />;

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
};

export default observer(App);

















//legacy code before mobx
// const handleEditActivity = (activity: IActivity) => {
//   setSubmitting(true);
//   agent.Activities.update(activity)
//     .then(() => {
//       setActivities([
//         ...activities.filter((a) => a.id !== activity.id),
//         activity,
//       ]);
//       setSelectedActivity(activity);
//       setEditMode(false);
//     })
//     .then(() => setSubmitting(false));
// };

// const handleDeleteActivity = (
//   event: SyntheticEvent<HTMLButtonElement>,
//   id: string
// ) => {
//   setSubmitting(true);
//   setTarget(event.currentTarget.name);
//   agent.Activities.delete(id)
//     .then(() => {
//       setActivities([...activities.filter((a) => a.id !== id)]);
//     })
//     .then(() => setSubmitting(false));
// };
