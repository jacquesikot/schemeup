import { useEffect, useRef, useState } from 'react';
import useAutocomplete, { AutocompleteGetTagProps } from '@mui/material/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { Avatar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { appColors } from '../BaseModal';
import Button from '../../global/Button';
import { useAppDispatch } from '../../../redux/hooks';
import { Role, addSchemaUsers } from '../../../redux/slice/schemas';
import { useQuery } from 'react-query';
import queryKeys from '../../../utils/keys/query';
import { getAllUsersApi } from '../../../api/user';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase.config';
import { UserPillDelete } from '../../../images/icons/UserPillDelete';

// Custom Mui AutoComplete Label, Input Wrapper, Tags + Input Element
const Root = styled('div')({
  color: 'rgba(0,0,0,.85)',
  fontSize: '14px',
});

const InputWrapper = styled('div')({
  width: '100%',
  height: '43px',
  border: `1px solid #d9d9d9`,
  backgroundColor: '#fff',
  borderRadius: '8px 0 0 10px',
  padding: '5px 6px',
  display: 'flex',
  flexWrap: 'nowrap',
  overflowX: 'auto',

  ' &:hover': {
    borderColor: appColors.primary,
  },

  ' &.focused': {
    borderColor: appColors.primary,
    boxShadow: '0 0 0 2px rgba(105, 65, 198, 0.2)',
  },

  ' & input': {
    backgroundColor: '#fff',
    color: 'rgba(0,0,0,.85)',
    height: '33px',
    fontSize: '15px',
    boxSizing: 'border-box',
    padding: '4px 6px',
    width: 0,
    minWidth: '100px',
    flexGrow: 1,
    border: 0,
    margin: 0,
    outline: 0,
  },

  '& input:focused': {},
});

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
  src: string;
  handleDelete: () => void;
}

const Tag = (props: TagProps) => {
  const { label, src, onDelete, handleDelete, ...other } = props;
  return (
    <div {...other}>
      <span>
        <Avatar src={src} sx={{ width: 16, height: 16, mr: 0.5 }} />
      </span>
      <span style={{ fontWeight: 450 }}>{label}</span>
      <UserPillDelete onClick={handleDelete} />
    </div>
  );
};

const StyledTag = styled(Tag)<TagProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '24px',
  margin: '2px 2.7px',
  maxWidth: 200,
  lineHeight: '22px',
  backgroundColor: `${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
  border: `1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#d9d9d9'}`,
  borderRadius: '6px',
  boxSizing: 'content-box',
  padding: '0 2px 0 4px',
  outline: 0,
  overflow: 'visible',
  color: '#344054',

  '&:focus': {
    borderColor: `${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'}`,
    backgroundColor: `${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'}`,
  },

  '& span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  '& svg': {
    fontSize: '12px',
    cursor: 'pointer',
    padding: '4px',
  },
}));

const Listbox = styled('ul')(
  ({ theme }) => `
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
    font-weight: 600;

    & svg {
      color: ${appColors.primary};
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
);

interface addUsersProps {
  schemaId: string;
}

const AddUsers = ({ schemaId }: addUsersProps) => {
  // sharedUsers will contain updated list of users in the
  // current state and can be used to update the users in memory who have access on Update Schema
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [user] = useAuthState(auth);
  // Ref for the InputWrapper div
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  useQuery(queryKeys.ALL_USERS, () => getAllUsersApi(user?.uid as string), {
    onSuccess: (data) => {
      setAllUsers(
        data
          .filter((d: any) => d.email !== user?.email)
          .map((d: any) => {
            return {
              name: d.fullName,
              email: d.email,
              photo: d.photoURL,
            };
          })
      );
    },
  });

  const { getRootProps, getInputProps, getTagProps, getListboxProps, getOptionProps, groupedOptions, value, focused } =
    useAutocomplete({
      id: 'add-new-users',
      multiple: true,
      freeSolo: true,
      disableListWrap: true,
      options: allUsers,
      value: selectedUsers,
      onChange: (e, value) => {
        // Concatenate the two arrays
        const combinedEmails = value.concat(selectedUsers);
        // Use the Set object to remove duplicates, then convert back to an array
        const uniqueCombinedEmail = Array.from(new Set(combinedEmails));
        setSelectedUsers(uniqueCombinedEmail);
      },
      getOptionLabel: (option) => option.email,
    });

  const addUsersToSchema = () => {
    dispatch(
      addSchemaUsers({
        schemaId,
        users: selectedUsers.map((user) => {
          return {
            email: user.email,
            role: Role.Viewer,
            name: user.name || '',
          };
        }),
      })
    );
    setSelectedUsers([]);
  };

  useEffect(() => {
    // Scroll to the input element when there are many tags
    if (inputWrapperRef.current) {
      inputWrapperRef.current.scrollLeft = inputWrapperRef.current.scrollWidth;
    }
  }, [value]); // Scroll whenever the value (selected users) changes

  const theme = useTheme();
  const colors = theme.palette;

  return (
    <Root>
      <div {...getRootProps()}>
        <Typography fontSize={14} fontWeight={500} color={colors.grey[700]}>
          Add Users
        </Typography>
        <div style={{ display: 'flex', gap: 0, marginTop: '5px' }}>
          <InputWrapper ref={inputWrapperRef} className={focused ? 'focused' : ''}>
            {value.map((option: any, index) => (
              <StyledTag
                label={typeof option === 'string' ? option : option.email}
                src={option.photo || 'https://www.gravatar.com/av'}
                {...getTagProps({ index })}
                handleDelete={() => setSelectedUsers(selectedUsers.filter((user) => user.email !== option.email))}
              />
            ))}
            <input {...getInputProps()} autoFocus placeholder="Enter user emails" type="email" />
          </InputWrapper>
          <Button
            type="primary"
            label="Add"
            height={43}
            style={{ borderRadius: '0 8px 10px 0' }}
            onClick={addUsersToSchema}
          />
        </div>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <li {...getOptionProps({ option, index })}>
              <span>{option.email}</span>
              <CheckIcon fontSize="small" />
            </li>
          ))}
        </Listbox>
      ) : null}
    </Root>
  );
};

export default AddUsers;
