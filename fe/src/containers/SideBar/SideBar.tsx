import * as React from 'react';
import { Formik, Field } from 'formik';

import { BurgerIcon, DoubleShewron, Modal, PlaceItem, SharePlaceItem, SelectField } from 'components';
import { 
  HandleDeletePlaceAction, 
  HandleUpdatePlaceAction, 
  IAllTagsSelect, 
  IPlaceModel, 
  SelectPlaceIdAction, 
  ToggleMenuStatus,
	HandleSharePlaceAction,
  HandleDeleteSharedPlaceAction,
  SearchPlaceAction,
  IFeature
} from 'store';
import { styled } from 'theme';

import { renderModalByType, SideBarModalConsts } from './Modals/Main';

const TabWrapper = styled.div<{ isActive: boolean }>`
	width: 72px;
	color: ${({ isActive, theme }) => isActive ? theme.color.primary : theme.color.black};
	padding-bottom: 3px;
	cursor: pointer;
	text-align: center;

	${({ isActive, theme }) => isActive && `
		border-bottom: 1px solid ${theme.color.primary};
	`}
`;

interface IWrapperProps {
  isMenuOpen: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  height: 100vh;
  width: 340px;
  position: absolute;
  background-color: ${({ theme }) => theme.color.white};
  z-index: 100;
  padding: 15px;

  ${({ isMenuOpen }) =>
    isMenuOpen
      ? `
    transform: translateX(0);
    transition: transform 0.5s ease-in-out;
  `
      : `
    transform: translateX(-100%);
    transition: transform 0.5s ease-in-out;
  `}

  .close-side-bar-btn {
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 20px;
	}
	
	.tabs {
		display: flex;
		justify-content: space-around;
		margin-top: 50px;
	}

  .favorite-place-block {
    margin-top: 20px;
  }

  .shared-place-block {
    margin-top: 20px;
  }
`;

interface ISideBarProps {
  isMenuOpen: boolean;
  toggleMenuStatus: ToggleMenuStatus;
  places: any[];
  sharedPlaces: any[];
  allTags: IAllTagsSelect;

  selectedPlace: IPlaceModel | null;
  selectPlaceIdAction: SelectPlaceIdAction;

  handleDeletePlaceAction: HandleDeletePlaceAction;
  handleUpdatePlaceAction: HandleUpdatePlaceAction;
  
  handleSharePlaceAction: HandleSharePlaceAction;
  handleDeleteSharedPlaceAction: HandleDeleteSharedPlaceAction;
  
  searchPlaceAction: SearchPlaceAction;
  searchPlaces: any[];
}

const SideBar: React.FC<ISideBarProps> = (props) => {
  const { toggleMenuStatus, isMenuOpen, places, selectPlaceIdAction, sharedPlaces, searchPlaceAction, searchPlaces } = props;

  const [modalType, setModalType] = React.useState<SideBarModalConsts | null>(null);
  const [isFavorites, setIsFavorites] = React.useState<boolean>(true);

  const handleClick = async (id: number, type: SideBarModalConsts, setIsOpen: (val: boolean) => void) => {
    await selectPlaceIdAction(id);
    setIsOpen(true);
    setModalType(type);
  };

  return (
    <Modal
      renderModalContent={(_, setIsOpen) => renderModalByType(modalType, { ...props, setIsOpen })}
      renderComponentContent={(_, setIsOpen) => (
        <>
          {!isMenuOpen && (
            <div className="burger-btn">
              <BurgerIcon onClick={() => toggleMenuStatus(true)} />
              <Formik
                initialValues={{ search: '' }}
                onSubmit={() => {}}
              >
                {({ setFieldValue }) => (
                  <Field
                    className="search-field"
                    name="search"
                    component={SelectField}
                    placeholder="Search for place"
                    onInputChange={(value: string) => {
                      if (value?.length > 2) {
                        searchPlaceAction(value);
                      }
                      setFieldValue('search', value);
                    }}
                    options={searchPlaces}
                  />
                )}
              </Formik>
            </div>
          )}
          <Wrapper isMenuOpen={isMenuOpen}>
            <div className="close-side-bar-btn" onClick={() => toggleMenuStatus(false)}>
              <DoubleShewron />
            </div>
            <div className="tabs">
              <TabWrapper isActive={isFavorites} onClick={() => setIsFavorites(true)}>
                Favorites
              </TabWrapper>
              <TabWrapper isActive={!isFavorites} onClick={() => setIsFavorites(false)}>
                Shared
              </TabWrapper>
            </div>
            {isFavorites ? (
              <div className="favorite-place-block">
                {places?.map(place => (
                  <PlaceItem 
                    key={String(place.id)}
                    place={place}
                    onDeleteClick={() => {
											handleClick(Number(place.id), SideBarModalConsts.DeletePlace, setIsOpen);
										}}
										onUpdateClick={() => {
											handleClick(Number(place.id), SideBarModalConsts.UpdatePlace, setIsOpen);
										}}
										onShareClick={() => {
											handleClick(Number(place.id), SideBarModalConsts.SharePlace, setIsOpen);
										}}
                  />
                ))}
              </div>
            ) : (
              <div className="shared-place-block">
                {sharedPlaces?.map(place => (
                  <SharePlaceItem 
                    key={String(place.id)}
                    place={place}
                    onDeleteClick={() => {
                      handleClick(Number(place.id), SideBarModalConsts.DeleteSharePlace, setIsOpen);
                    }}
                  />
                ))}
              </div>
            )}
          </Wrapper>
        </>
      )}
    />
  );
};

export default SideBar;
