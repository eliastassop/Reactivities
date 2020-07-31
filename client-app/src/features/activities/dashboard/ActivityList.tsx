import React, { useContext, Fragment } from "react";
import { Label, Item } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";

import ActivityListItem from "./ActivityListItem";

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { activitiesByDate } = activityStore;
  return (
    <Fragment>
      {activitiesByDate.map(([papapap, activities]) => (
        <Fragment key={papapap}>
          <Label size="large" color="blue">
            {papapap}
          </Label>
          
            {/* add clearing above in segment */}
            <Item.Group divided>
              {activities.map((activity) => (
                <ActivityListItem key={activity.id} activity={activity} />
              ))}
            </Item.Group>
          
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
