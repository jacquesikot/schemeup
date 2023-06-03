import { Tab, setNewTab } from '../redux/slice/apptabs';

const newAppTab = (dispatch: any, title: string, route: string, tabs: Tab[], navigate: any, meta?: any) => {
  const tabExists = tabs.filter((t) => t.title === title).length > 0;

  if (tabExists) {
    navigate(route);
  } else {
    dispatch(setNewTab({ title, route, meta }));
    navigate(route);
  }
};

export default newAppTab;