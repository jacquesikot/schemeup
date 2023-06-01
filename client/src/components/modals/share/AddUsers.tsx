import { useState } from 'react';
import useAutocomplete, { AutocompleteGetTagProps } from '@mui/material/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { Avatar, colors } from '@mui/material';
import { appColors } from '../BaseModal';

// Custom Mui AutoComplete Label, Input Wrapper, Tags + Input Element
const Root = styled('div')({
  color: "rgba(0,0,0,.85)",
  fontSize: "14px",
});

const Label = styled('label')({
  padding: "0 0 4px",
  lineHeight: 1.5,
  display: "block",
});

const InputWrapper = styled('div')({
  width: "100%",
  height: "40px",
  border: `1px solid #d9d9d9`,
  backgroundColor: '#fff',
  borderRadius: "5px",
  padding: "3px",
  display: "flex",
  flexWrap: "nowrap",
  overflowX: "scroll",

  ' &:hover': {
    borderColor: appColors.primary,
  },

  ' &.focused': {
    borderColor: appColors.primary,
    boxShadow: "0 0 0 2px rgba(105, 65, 198, 0.2)",
  },

  ' & input': {
    backgroundColor: '#fff',
    color: 'rgba(0,0,0,.85)',
    height: "30px",
    boxSizing: "border-box",
    padding: "4px 6px",
    width: 0,
    minWidth: "30px",
    flexGrow: 1,
    border: 0,
    margin: 0,
    outline: 0,
  },

  '& input:focused': {

  },
});

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
  src: string;
}

const Tag = (props: TagProps) => {
  const { label, src, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span><Avatar src={src} sx={{ width: 16, height: 16, mr: .5 }}/></span>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

const StyledTag = styled(Tag)<TagProps>(
  ({ theme }) => ({
    display: "flex",
    alignItems: "center",
    height: "24px",
    margin: "2px",
    lineHeight: "22px",
    backgroundColor: `${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'}`,
    border: `1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'}`,
    borderRadius: "2px",
    boxSizing: "content-box",
    padding: "0 4px 0 10px",
    outline: 0,
    overflow: "visible",

    '&:focus': {
      borderColor: `${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'}`,
      backgroundColor: `${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'}`,
    },

    '& span': {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },

    '& svg': {
      fontSize: "12px",
      cursor: "pointer",
      padding: "4px",
    },
  })
);

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
`,
);

interface UserInfoType {
  name: string;
  email: string;
}

// List of all Schemeup Users with UserInfoType only data as autocomplete listbox options
const schemeupUsers = [
  { name: "Daniel Wu", email: "daniel@untitledui.com" },
  { name: "Candace Wallie", email: "candace@untitledui.com" },
  { name: "Drew Cano", email: "drew@untitledui.com" },
  { name: "Jacques Paul", email: "jacques@untitledui.com" },
  { name: "Demi Wikinson", email: "demi@untitledui.com" },
];
// Already added users who have access to the schema
const defaultSharedUsers = [
  { name: "Candace", email: "candace@untitledui.com" },
  { name: "Jacques", email: "jacques@untitledui.com" },
];

const AddUsers = () => {
  // sharedUsers will contain updated list of users in the
  // current state and can be used to update the users in memory who have access on Update Schema
  const [sharedUsers, updateSharedUsers] = useState(defaultSharedUsers);

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'add-new-users',
    defaultValue: [...sharedUsers],
    multiple: true,
    freeSolo: true,
    disableListWrap: true,
    options: schemeupUsers,
    onChange: (e, value) => {
      const newInput = value[value.length - 1];
      if (typeof newInput === "string") {
        const newUser = { name: newInput, email: newInput };
        console.log(newUser);
        updateSharedUsers((prevState) => ([newUser, ...prevState]));
      }
    },
    getOptionLabel: (option) => option.name,
  });

  return (
    <Root>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()}>Add Users</Label>
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''} >
          {value.map((option, index) => (
            <StyledTag
              label={typeof option === "string" ? option : (option as UserInfoType).name}
              src={typeof option === "string" ? '' : 'https://mkorostoff.github.io/hundred-thousand-faces/img/f/4.jpg'}
              {...getTagProps({ index })}
            />
          ))}
          <input {...getInputProps()} autoFocus />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {(groupedOptions as typeof schemeupUsers).map((option, index) => (
            <li {...getOptionProps({ option, index })}>
              <span>{option.name}</span>
              <CheckIcon fontSize="small" />
            </li>
          ))}
        </Listbox>
      ) : null}
    </Root>
  );
}

export default AddUsers;