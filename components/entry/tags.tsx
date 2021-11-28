/* eslint-disable react/jsx-props-no-spreading */
import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import {
  Box,
  Tag as ChakraTag,
  Flex,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Spinner,
  TagCloseButton,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useCombobox, useMultipleSelection } from 'downshift';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

import { fetcher } from '~/lib/hooks';
import { TagsData } from '~/pages/api/tags';

interface EntryTagsProps {
  tags: string[];
  isEditing: boolean;
  onAddTag(tag: string): void;
  onRemoveTag(tag: string): void;
}

export const EntryTags: React.VFC<EntryTagsProps> = ({
  isEditing,
  onAddTag,
  onRemoveTag,
  ...props
}) => {
  const size = useBreakpointValue({ base: 'md', md: 'sm' });
  const addHoverColor = useColorModeValue('orange.200', 'rgba(251, 211, 141, 0.36)');
  const addActiveColor = useColorModeValue('orange.300', 'rgba(251, 211, 141, 0.56)');
  // TODO: handle this differently when it's hooked up to a form. It seems even passing a different
  // reference in as props doesn't trigger a re-render
  const [tags, setTags] = useState(props.tags);

  const handleAddTag = (tag: string) => {
    setTags([...tags, tag]);
    onAddTag(tag);
  };
  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((item) => item !== tag);
    setTags(newTags);
    onRemoveTag(tag);
  };

  return (
    <Flex wrap="wrap">
      {tags.map((tag) => (
        <ChakraTag key={tag} colorScheme="orange" size={size} mt="auto" mr={1} mb={1}>
          {tag}
          {isEditing && <TagCloseButton onClick={() => handleRemoveTag(tag)} />}
        </ChakraTag>
      ))}
      {isEditing && (
        <Popover closeOnBlur closeOnEsc>
          <PopoverTrigger>
            <ChakraTag
              as="button"
              colorScheme="orange"
              size={size}
              mt="auto"
              mb={1}
              px={4}
              cursor="pointer"
              _hover={{ bg: addHoverColor }}
              _active={{ bg: addActiveColor }}
            >
              <AddIcon boxSize={2} my="auto" />
            </ChakraTag>
          </PopoverTrigger>
          {/* TODO: make this go under the Flex container rather than the Trigger, because it
          create jank when the width of the tags change and the dialog moves. Just doing the
          `containerRef` on this doesn't seem to do it. */}
          <Portal>
            <PopoverContent p={2}>
              <AddTag
                selectedTags={tags}
                onSelectTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              />
            </PopoverContent>
          </Portal>
        </Popover>
      )}
    </Flex>
  );
};

interface AddTagProps {
  selectedTags: string[];
  onSelectTag(tag: string): void;
  onRemoveTag(tag: string): void;
}

const AddTag: React.VFC<AddTagProps> = (props) => {
  const [tags, isLoading] = useTags();

  if (isLoading) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  return <AddTagDialog tags={tags} {...props} />;
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
  const { data } = useSWR<TagsData>('/api/tags', fetcher);
  const isLoading = data === undefined;
  const tags = data?.tags.map((t) => t.text) ?? [];
  return [tags, isLoading];
}
