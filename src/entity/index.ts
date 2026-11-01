/**
 * @fileoverview Entity Components Library
 * @description UI components for entity/organization management
 *
 * @example
 * ```tsx
 * import {
 *   EntitySelector,
 *   EntityList,
 *   MemberList,
 *   InvitationForm,
 * } from '@sudobility/components/entity';
 *
 * function WorkspaceSwitcher() {
 *   return (
 *     <EntitySelector
 *       entities={entities}
 *       currentEntity={currentEntity}
 *       onSelect={handleSelect}
 *       onCreateNew={handleCreateNew}
 *     />
 *   );
 * }
 * ```
 */

// Component exports
export {
  EntityCard,
  type EntityCardProps,
  EntityList,
  type EntityListProps,
  EntitySelector,
  type EntitySelectorProps,
  MemberList,
  type MemberListProps,
  MemberRoleSelector,
  type MemberRoleSelectorProps,
  InvitationForm,
  type InvitationFormProps,
  InvitationList,
  type InvitationListProps,
} from './components';

// Utility exports
export { cn } from './lib/utils';
