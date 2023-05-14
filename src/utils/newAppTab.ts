import { Tab, setNewTab } from '../redux/slice/apptabs';

const newAppTab = (dispatch: any, title: string, route: string, tabs: Tab[], navigate: any) => {
  const tabExists = tabs.filter((t) => t.title === title).length > 0;

  if (tabExists) {
    navigate(route);
  } else {
    dispatch(setNewTab({ title, route }));
    navigate(route);
  }
};

export default newAppTab;
