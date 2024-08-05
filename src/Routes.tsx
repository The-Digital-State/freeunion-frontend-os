import { Redirect, Route, Switch } from 'react-router-dom';
import { Registration } from 'components/Auth/Registration/Registration';

import { Auth } from 'components/Auth/Auth';
import { VerifyEmail } from 'components/VerifyEmail/VerifyEmail';
import { ErrorPage } from 'components/ErrorPage/ErrorPage';
import { RulesService } from 'components/RulesService/RulesService';
import { PrivacyPolicy } from 'components/PrivacyPolicy/PrivacyPolicy';
import { PrivateRoute } from 'common/Routing/PrivateRoute/PrivateRoute';
import { CreateUnion } from 'components/CreateUnion/CreateUnion';
import { EditUserProfile } from 'components/EditUserProfile/EditUserProfile';
import { Alliance } from 'containers/Alliance/Alliance';
import { RoutingContainer } from 'common/Routing/RoutingContainer/RoutingContainer';
import EnterOrganization from 'containers/EnterOrganization/EnterOrganization';
import Unions from 'containers/Unions/Unions';
import { InvitationScreen } from 'components/InvitationScreen/InvitationScreen';
import { LaborUnion } from 'containers/LaborUnion/LaborUnion';
import { Security } from 'components/Security/Security';
import { SimpleRoutingContainer } from 'common/Routing/SimpleRoutingContainer/SimpleRoutingContainer';
import { InviteColleague } from 'components/InviteColleague/InviteColleague';
import { Landing } from 'components/Landing/Landing';
import { CommentoSso } from 'components/Commento/CommentoSso';
import { useContext } from 'react';
import { GlobalContext } from 'contexts/GlobalContext';
import Settings from 'pages/Settings/Settings';
import { TaskContainer } from 'pages/task/TaskContainer';
import News from 'pages/News/News';
import NewsDetails from 'pages/NewsDetails/NewsDetails';
import SupportUs from 'components/SupportUs/SupportUs';
import NewsSuggest from 'pages/NewsSuggest/NewsSuggest';
import Chat from 'shared/Chat/Chat';
import { toast } from 'react-toastify';
import PaymentStatus from 'components/PaymentStatus/PaymentStatus';
import TagsNews from 'pages/TagsNews/TagsNews';
import Stickers from 'pages/Stickers/Stickers';
import Press from 'components/Press/Press';
import ContactUs from 'pages/ContactUs/ContactUs';
import Guarantee from 'pages/Guarantee/Guarantee';
import AboutUs from 'pages/AboutUs/AboutUs';
import SectionMaterials from 'pages/KnowledgeBase/SectionMaterials/SectionMaterials';
import MaterialDetails from 'pages/MaterialDetails/MaterialDetails';
import formatServerError from 'utils/formatServerError';
import KnowledgeBaseMaterials from 'pages/KnowledgeBase/KnowledgeBaseMaterials';
import TagsMaterials from 'pages/TagsMaterials/TagsMaterials';
import KnowledgeBaseSections from 'pages/KnowledgeBase/KnowledgeBaseSections';
import { Suggestion } from 'pages/Suggestion/Suggestion';
import OrganisationsNews from 'pages/OrganisationsNews/OrganisationsNews';
import Poll from 'pages/Poll/Poll';

export const routes = {
  enterUnion: {
    route: '/enter-union/:id',
    getLink(id) {
      return this.route.replace(':id', id);
    },
    requireAuth: true,
  },
  union: {
    route: `/union/:id`,
    getLink(id) {
      return this.route.replace(':id', id);
    },
  },
  unionNews: {
    route: `/org/:organizationId/news`,
    getLink(id) {
      return this.route.replace(':organizationId', id);
    },
  },
  task: {
    route: `/union/:orgId/tasks/:taskId`,
    getLink(orgId, taskId) {
      return this.route.replace(':orgId', orgId).replace(':taskId', taskId);
    },
  },
  tasks: {
    route: `/union/:id/tasks`,
    getLink(id) {
      return this.route.replace(':id', id);
    },
  },

  newsDetails: {
    route: `/news/:orgId/:id`,
    getLink(orgId, id) {
      return this.route.replace(':orgId', orgId).replace(':id', id);
    },
  },

  newsSuggest: {
    route: `/news/:organizationId/suggest`,
    getLink(orgId) {
      return this.route.replace(':organizationId', orgId);
    },
  },

  suggestion: {
    route: `/union/:organizationId/suggestion/:suggestionId`,
    getLink(orgId, suggestionId) {
      return this.route.replace(':organizationId', orgId).replace(':suggestionId', suggestionId);
    },
  },

  sectionMaterials: {
    // TODO: add /union/${id} to route
    route: `/:organizationId/section/:sectionId/materials`,
    getLink(orgId, sectionId) {
      return this.route.replace(':organizationId', orgId).replace(':sectionId', sectionId);
    },
  },

  poll: {
    route: `/:organizationId/poll/:pollId`,
    getLink(orgId, pollId) {
      return this.route.replace(':organizationId', orgId).replace(':pollId', pollId);
    },
  },

  closePoll: {
    route: `/:organizationId/poll/:pollId/closed`,
    getLink(orgId, pollId) {
      return this.route.replace(':organizationId', orgId).replace(':pollId', pollId);
    },
  },

  materialDetails: {
    route: `/:organizationId/materials/:materialId`,
    getLink(orgId, materialId) {
      return this.route.replace(':organizationId', orgId).replace(':materialId', materialId);
    },
  },
  chat: '/chat',

  settings: '/settings',

  // old code, use small letter!!!
  HOME: '/',
  LOGIN: '/login',
  PRESS: '/press',
  ABOUT_US: '/about-us',
  INVITATION_PAGE: '/invitation-page',
  FORGET_PASSWORD: '/forget-password',
  REGISTRATION: '/registration',
  UNION: '/union',
  UNION_FU: '/union/free-union',
  UNIONS: '/unions',
  CONTACT_US: '/contact-us',
  LABOR_UNION: '/labor-union',
  EDIT_USER_PROFILE: '/edit-user-profile',
  VERIFY_EMAIL: '/email/verify',
  SSO_COMMENTO: '/sso/commento',
  RESET_PASSWORD: '/email/reset',
  ERROR_PAGE: '/error-page',
  SECURITY: '/security',
  GUARANTEE: '/guarantee',
  PRIVACY_POLICY: '/privacy-policy',
  RULES_SERVICE: '/rules-service',
  INVITE_COLLEAGUE: '/invite-colleague',
  LANDING: '/Landing',
  INVITATION_SCREEN: '/invitation-screen',
  SUGGESTIONS: '/suggestions',
  CREATE_UNION: '/union-new',
  ENTER_UNION: '/enter-union',
  NEWS: '/news',
  KNOWLEDGE_BASE_MATERIALS: '/kbase/materials',
  KNOWLEDGE_BASE_SECTIONS: '/kbase/sections',
  NEWS_BELARUS_FOR_UKRAINE: '/belarus-with-ukraine-news',
  STICKERS: '/stickers',
  SUPPORT_US: '/support-us',
  PAYMENT_STATUS: '/payment-status',
  TAGS_NEWS: '/tags-news',
  TAGS_MATERIALS: '/kbase/materials/tag',
  UNION_NEWS: '/org/:organizationId/news',
};

export function Routes() {
  const {
    services: { userService },
    openModal,
    closeModal,
    setSidebarExpandedState,
  } = useContext(GlobalContext);

  const getUser = () => {
    try {
      return userService.getUser();
    } catch (error) {
      console.error(error);
      toast(formatServerError(error.data));
    }
  };

  return (
    <Switch>
      <Route exact path="/dashboard">
        <Redirect to={routes.UNION} />
      </Route>
      <Route exact path={routes.HOME}>
        <Landing />
      </Route>

      <Route path={`${routes.VERIFY_EMAIL}/:id/:hash`}>
        <VerifyEmail />
      </Route>

      <Route path={`${routes.SSO_COMMENTO}`}>
        <CommentoSso />
      </Route>

      <Route path={routes.LOGIN}>
        <Auth type="login" />
      </Route>

      <Route path={routes.PRESS}>
        <SimpleRoutingContainer closeButtonRoute={routes.HOME} title="О нас">
          <Press />
        </SimpleRoutingContainer>
      </Route>

      <Route path={routes.SUPPORT_US}>
        <SimpleRoutingContainer closeButtonRoute={routes.HOME} showCloseButton logoWithText>
          <SupportUs />
        </SimpleRoutingContainer>
      </Route>

      <Route path={routes.INVITATION_PAGE}>
        <Auth type="invitationPage" />
      </Route>

      <Route path={routes.FORGET_PASSWORD}>
        <Auth type="forgetPassword" />
      </Route>

      <Route path={`${routes.RESET_PASSWORD}/:token`}>
        <Auth type="resetPassword" />
      </Route>

      <Route path={routes.REGISTRATION}>
        <Registration />
      </Route>

      <Route path={routes.ERROR_PAGE}>
        <ErrorPage />
      </Route>

      <Route path={routes.CONTACT_US}>
        <SimpleRoutingContainer title="Контакты" showCloseButton>
          <ContactUs />
        </SimpleRoutingContainer>
      </Route>

      <Route path={routes.SECURITY}>
        <SimpleRoutingContainer component={Security} showCloseButton={true} closeButtonRoute={routes.UNION} showScrollToTopButton />
      </Route>

      <Route path={routes.GUARANTEE}>
        <PrivateRoute>
          <Guarantee />
        </PrivateRoute>
      </Route>

      <Route path={routes.ABOUT_US}>
        <SimpleRoutingContainer title="О нас" showCloseButton>
          <AboutUs />
        </SimpleRoutingContainer>
      </Route>

      <Route path={routes.RULES_SERVICE}>
        <SimpleRoutingContainer
          component={RulesService}
          showCloseButton={userService.isLoggedIn}
          closeButtonRoute={routes.UNION}
          showScrollToTopButton
        />
      </Route>

      <Route path={routes.PRIVACY_POLICY}>
        <SimpleRoutingContainer
          component={PrivacyPolicy}
          showCloseButton={userService.isLoggedIn}
          closeButtonRoute={routes.UNION}
          showScrollToTopButton
        />
      </Route>
      <Route path={routes.task.route}>
        <TaskContainer />
      </Route>

      <Route path={routes.suggestion.route}>
        <Suggestion />
      </Route>

      <Route path={[routes.union.route, routes.UNION, routes.UNION_FU]}>
        <RoutingContainer>
          <Alliance />
        </RoutingContainer>
      </Route>

      <Route path={routes.UNIONS}>
        <SimpleRoutingContainer title="Все объединения" showCloseButton showScrollToTopButton mobileWithoutPadding>
          <Unions />
        </SimpleRoutingContainer>
      </Route>

      <Route path={routes.UNION_NEWS}>
        <OrganisationsNews />
      </Route>

      <Route path={routes.enterUnion.route}>
        <PrivateRoute>
          <EnterOrganization />
        </PrivateRoute>
      </Route>

      <Route path={routes.LABOR_UNION}>
        <PrivateRoute>
          <RoutingContainer>
            <LaborUnion />
          </RoutingContainer>
        </PrivateRoute>
      </Route>

      <Route path={routes.CREATE_UNION}>
        <PrivateRoute>
          <RoutingContainer withFooter={false} showCloseButton={true} withSidebar={false}>
            <CreateUnion />
          </RoutingContainer>
        </PrivateRoute>
      </Route>

      <Route path={routes.EDIT_USER_PROFILE}>
        <PrivateRoute>
          <RoutingContainer withSidebar={false} withFooter={false} showCloseButton={true} closeButtonRoute={routes.UNION}>
            <EditUserProfile />
          </RoutingContainer>
        </PrivateRoute>
      </Route>

      <Route path={routes.INVITE_COLLEAGUE}>
        <PrivateRoute>
          <InviteColleague />
        </PrivateRoute>
      </Route>

      <Route path={routes.INVITATION_SCREEN}>
        <PrivateRoute>
          <InvitationScreen />
        </PrivateRoute>
      </Route>

      <Route exact path={routes.NEWS}>
        <SimpleRoutingContainer showCloseButton closeButtonRoute={routes.UNION} logoWithText>
          <News />
        </SimpleRoutingContainer>
      </Route>

      <Route exact path={routes.KNOWLEDGE_BASE_MATERIALS}>
        <SimpleRoutingContainer showCloseButton closeButtonRoute={routes.UNION} logoWithText>
          <KnowledgeBaseMaterials />
        </SimpleRoutingContainer>
      </Route>

      <Route exact path={routes.KNOWLEDGE_BASE_SECTIONS}>
        <SimpleRoutingContainer showCloseButton closeButtonRoute={routes.UNION} logoWithText>
          <KnowledgeBaseSections />
        </SimpleRoutingContainer>
      </Route>

      <Route path={[routes.TAGS_NEWS, routes.NEWS_BELARUS_FOR_UKRAINE]}>
        <TagsNews />
      </Route>
      <Route path={routes.TAGS_MATERIALS}>
        <TagsMaterials />
      </Route>

      <Route path={routes.STICKERS}>
        <SimpleRoutingContainer showCloseButton closeButtonRoute={routes.HOME} hideLogo>
          <Stickers />
        </SimpleRoutingContainer>
      </Route>

      <Route path={routes.newsSuggest.route}>
        <PrivateRoute>
          <NewsSuggest />
        </PrivateRoute>
      </Route>

      <Route exact path={routes.poll.route}>
        <Poll />
      </Route>

      <Route exact path={routes.closePoll.route}>
        <Poll closed />
      </Route>

      <Route exact path={routes.newsDetails.route}>
        <NewsDetails />
      </Route>

      <Route exact path={routes.materialDetails.route}>
        <MaterialDetails />
      </Route>

      <Route path={routes.chat}>
        <PrivateRoute>
          <RoutingContainer withSidebar withFooter={false}>
            <Chat openModal={openModal} closeModal={closeModal} getUserData={getUser} onMenuClick={setSidebarExpandedState} />
          </RoutingContainer>
        </PrivateRoute>
      </Route>
      <Route path={routes.sectionMaterials.route}>
        <SimpleRoutingContainer showCloseButton closeButtonRoute={routes.UNION} logoWithText>
          <SectionMaterials />
        </SimpleRoutingContainer>
      </Route>

      <Route path={routes.settings}>
        <PrivateRoute>
          <RoutingContainer closeButtonRoute={routes.UNION} showCloseButton withSidebar={false}>
            <Settings />
          </RoutingContainer>
        </PrivateRoute>
      </Route>

      <Route exact path={routes.PAYMENT_STATUS}>
        <SimpleRoutingContainer showCloseButton closeButtonRoute={routes.UNION}>
          <PaymentStatus />
        </SimpleRoutingContainer>
      </Route>

      <Route path="*">
        <div>Страница не найдена</div>
      </Route>
    </Switch>
  );
}
