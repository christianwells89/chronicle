import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  HStack,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Spinner,
  Tag,
  TagCloseButton,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useCombobox, useMultipleSelection } from 'downshift';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

import { TagsData } from '~/pages/api/tags';

// There is a fair bit of jank with this since I did it a year and a half ago. This can be improved
// by both re-evaluating if Chakra's Popper has changed as well as taking a look at the below repo
// which does a lot of what I'm doing here, except that it actually works nicely. It's opinionated
// in how it displays the options and it also hasn't been updated in 2 years, so using it directly
// is not desirable.
// https://github.com/koolamusic/chakra-ui-autocomplete

interface EditingEntryTagsProps {
  tags: string[];
  onChange(tags: string[]): void;
}

export const EditingEntryTags: React.FC<EditingEntryTagsProps> = ({ tags, onChange }) => {
  const size = useBreakpointValue({ base: 'md', md: 'sm' });

  const handleAddTag = (tag: string) => {
    onChange([...tags, tag]);
  };
  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((item) => item !== tag);
    onChange(newTags);
  };

  return (
    <HStack wrap="wrap">
      {tags.map((tag) => (
        <Tag key={tag} colorScheme="orange" size={size}>
          {tag}
          <TagCloseButton onClick={() => handleRemoveTag(tag)} />
        </Tag>
      ))}
      <Popover closeOnBlur closeOnEsc>
        <PopoverTrigger>
          <Tag
            as="button"
            type="button"
            colorScheme="orange"
            size={size}
            mt="auto"
            mb={1}
            px={4}
            cursor="pointer"
            _hover={{ bg: useColorModeValue('orange.200', 'rgba(251, 211, 141, 0.36)') }}
            _active={{ bg: useColorModeValue('orange.300', 'rgba(251, 211, 141, 0.56)') }}
          >
            <AddIcon boxSize={2} my="auto" />
          </Tag>
        </PopoverTrigger>
        {/* TODO: make this go under the Flex container rather than the Trigger, because it
          create jank when the width of the tags change and the dialog moves. Just doing the
          `containerRef` on this doesn't seem to do it. */}
        <Portal>
          <PopoverContent p={2}>
            <AddTag selectedTags={tags} onSelectTag={handleAddTag} onRemoveTag={handleRemoveTag} />
          </PopoverContent>
        </Portal>
      </Popover>
    </HStack>
  );
};

interface AddTagProps {
  selectedTags: string[];
  onSelectTag(tag: string): void;
  onRemoveTag(tag: string): void;
}

const AddTag: React.VFC<AddTagProps> = ({ selectedTags, onSelectTag, onRemoveTag }) => {
  const [tags, isLoading] = useTags();

  if (isLoading) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  return (
    <AddTagDialog
      tags={tags}
      selectedTags={selectedTags}
      onSelectTag={onSelectTag}
      onRemoveTag={onRemoveTag}
    />
  );
};

interface AddTagDialogProps extends AddTagProps {
  tags: string[];
}

const AddTagDialog: React.VFC<AddTagDialogProps> = ({
  selectedTags,
  onSelectTag,
  onRemoveTag,
  ...props
}) => {
  const [tags, setTags] = useState(props.tags);
  const [isCreating, setIsCreating] = useState(false);
  const [inputItems, setInputItems] = useState(tags);
  const disclosureRef = useRef(null);
  const menuRef = useRef(null);
  const itemBackgroundColor = useColorModeValue('gray.200', 'gray.600');

  const { getDropdownProps, addSelectedItem, removeSelectedItem, activeIndex } =
    useMultipleSelection({
      selectedItems: selectedTags,
      stateReducer: (_, actionAndChanges) => {
        const { type, changes } = actionAndChanges;
        switch (type) {
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            return {
              ...changes,
              activeIndex: undefined,
            };
          default:
            return changes;
        }
      },
    });

  const {
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    inputValue,
  } = useCombobox({
    selectedItem: undefined,
    items: inputItems,
    isOpen: true,
    onInputValueChange: ({ inputValue: innerInputValue = '' }) => {
      const filteredItems = tags.filter((tag) =>
        tag.toLowerCase().includes(innerInputValue.toLowerCase()),
      );

      if (isCreating && filteredItems.length > 0) {
        setIsCreating(false);
      }

      setInputItems(filteredItems);
    },
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputBlur:
          return { ...changes, highlightedIndex: -1, inputValue: '' };
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            isOpen: true,
            inputValue: '',
          };
        case useCombobox.stateChangeTypes.InputChange:
          return { ...changes, highlightedIndex: 0 };
        default:
          return changes;
      }
    },
    onStateChange: ({ type, selectedItem }) => {
      // TODO: figure out why this doesn't run _sometimes_ like when a newly selected tag is then
      // selected again in an attempt to remove it
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (selectedItem) {
            if (selectedTags.includes(selectedItem)) {
              removeSelectedItem(selectedItem);
              onRemoveTag(selectedItem);
            } else if (isCreating) {
              // TODO: handle this differently - a new option should be able to be added even if it
              // is a substring of an existing one
              onSelectTag(selectedItem);
              setIsCreating(false);
              const newTags = [...tags, selectedItem];
              setTags(newTags);
              setInputItems(newTags);
            } else {
              addSelectedItem(selectedItem);
              onSelectTag(selectedItem);
            }
          }
          break;
        default:
          break;
      }
    },
  });

  useEffect(() => {
    if (inputItems.length === 0 && activeIndex === -1 && inputValue.length > 0) {
      setIsCreating(true);
      setInputItems([inputValue]);
    }
  }, [inputItems, setIsCreating, inputValue, activeIndex]);

  return (
    <Box>
      <Box {...getComboboxProps()}>
        <Input
          size="sm"
          // TODO: this doesn't work - need to pass autoFocusRef to Popover but having a
          // conditional render of the loading screen messes it up
          autoFocus
          {...getInputProps(
            getDropdownProps({
              ref: disclosureRef,
            }),
          )}
        />
        <Box mt={2} {...getMenuProps({ ref: menuRef })}>
          <VStack>
            {inputItems.map((item, index) => (
              <Box
                key={item}
                cursor="pointer"
                width="full"
                bg={highlightedIndex === index ? itemBackgroundColor : undefined}
                borderRadius="md"
                px={2}
                {...getItemProps({ item, index })}
              >
                {isCreating ? (
                  <Text>Create {item}</Text>
                ) : (
                  <Flex>
                    <Text flex="1" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      {item}
                    </Text>
                    {selectedTags.includes(item) && <CheckIcon boxSize={2} ml={2} my="auto" />}
                  </Flex>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

function useTags(): [string[], boolean] {
  const { data } = useSWR<TagsData>('/api/tags');
  const isLoading = data === undefined;
  const tags = data?.tags.map((t) => t.text) ?? [];
  return [tags, isLoading];
}
