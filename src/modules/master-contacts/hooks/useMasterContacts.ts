import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masterContactsApi } from '../services';
import {
  CategoryDto,
  DepartmentDto,
  DesignationDto,
  QualificationDto,
  RelationshipDto,
  TitleDto,
  CityDto,
  AddressDto,
  ModeOfContactDto,
  ModeOfContactTypeDto,
  StateDto,
  RegionDto,
} from '../types';

type ResourceTypeMap = {
  categories: CategoryDto;
  departments: DepartmentDto;
  designations: DesignationDto;
  qualifications: QualificationDto;
  relationships: RelationshipDto;
  titles: TitleDto;
  city: CityDto;
  address: AddressDto;
  organizationsDropdown: any;
  countryDropdown: any;
  stateDropdown: any;
  modeOfContact: ModeOfContactDto;
  mocTypesDropdown: ModeOfContactTypeDto;
  state: StateDto;
  region: RegionDto;
};

export const useMasterContacts = <T extends Exclude<keyof typeof masterContactsApi, 'individuals'>>(
  resource: T,
) => {
  const queryClient = useQueryClient();
  type DTO = ResourceTypeMap[T];

  const api = masterContactsApi[resource] as unknown as {
    list: () => Promise<DTO[]>;
    create: (data: DTO) => Promise<DTO>;
    update: (id: number, data: Partial<DTO>) => Promise<DTO>;
    remove: (id: number) => Promise<void>;
  };

  const queryKey = ['master-contacts', resource];

  const listQuery = useQuery({
    queryKey,
    queryFn: () => api.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data: DTO) => api.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DTO> }) => api.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    list: listQuery,
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
  };
};
