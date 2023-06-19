import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

import { setNewTab } from '../redux/slice/apptabs';
import routes from '../routes';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

// UPDATE FOR ALL THE TAB OPTIONS
const returnTitleFromRoute = (route: string) => {
  if (route === routes.DATASOURCES) return 'Datasources';
  if (route === routes.HOME) return 'Schema Home';
  if (route === routes.MOCK_DATA) return 'Mock Data';
  return 'New Tab';
};

const useAppTab = () => {
  const tabs = useAppSelector((state) => state.appTabs.tabs);
  const schemas = useAppSelector((state) => state.schemas.schemas);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const newAppTab = (route: string) => {
    const tabExists = tabs.filter((t) => t.route === route).length > 0;

    if (tabExists) {
      navigate(route);
    } else {
      let title = '';
      if (route.includes(routes.EDIT_SCHEMA)) {
        if (
          schemas.filter((s) => s.id === route.slice(-36)) &&
          schemas.filter((s) => s.id === route.slice(-36)).length > 0 &&
          schemas.filter((s) => s.id === route.slice(-36))[0].title
        ) {
          title = schemas.filter((s) => s.id === route.slice(-36))[0].title;
        } else {
          title = 'New Schema';
        }
      } else {
        title = returnTitleFromRoute(route);
      }
      dispatch(setNewTab({ id: uuidv4(), title, route }));
      navigate(route);
    }
  };

  return { newAppTab };
};

export default useAppTab;
