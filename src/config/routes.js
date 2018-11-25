import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'containers/Home';
import Login from 'containers/Login';
import Healtandsafetypage from 'containers/Health';
import Dashboard from 'containers/DashboardContainer';
import Worklist from 'containers/Worklist';
import OpenSD from 'containers/OpenSD';
import ChecklistSection from 'containers/ChecklistSection';
import ChecklistSubSection from 'containers/ChecklistSubSection';
import QuestionSet from 'containers/QuestionSet';
import Question from 'containers/Question';
import CreateSupplierDiagnostic from 'containers/CreateSupplierDiagnostic';
import { requireAuthentication } from '../components/Authenticated/Authenticated';
import CRlist from 'containers/CRlist';
import Files from 'containers/Files';
import Crresponsible from 'containers/CRrepo';

const rulesMatrix = {
  rule2: ['STA_engineer'],
  rule4: ['sta_manager'],
  rule3: ['STA_engineer', 'sta_manager', 'sta_engineer'],
};


const rootView = (
  <Route path="/" component={Home} >
   <IndexRoute component={requireAuthentication(Login, rulesMatrix.rule3)} />
   <Route path="/dashboard" component={requireAuthentication(Dashboard, rulesMatrix.rule3)} />
   <Route path="/healthsafety" component={requireAuthentication(Healtandsafetypage, rulesMatrix.rule3)} />
   <Route path="/crlink/:sdId/:sectionId" component={requireAuthentication(CRlist, rulesMatrix.rule3)} />
   <Route path="/CRinfo/:sdId/:questionId" component={requireAuthentication(Crresponsible, rulesMatrix.rule3)} />
   <Route path="/worklist" component={requireAuthentication(Worklist, rulesMatrix.rule3)}/>
   <Route path="/opensd/:sdId" component={requireAuthentication(OpenSD, rulesMatrix.rule3)} />
   <Route path="/checklistSection/:sdId" component={requireAuthentication(ChecklistSection, rulesMatrix.rule3)} />
   <Route path="/checklistSubSection/:sdId/:sectionId" component={requireAuthentication(ChecklistSubSection, rulesMatrix.rule3)} />
   <Route path="/questionSet/:sdId/:sectionId/:subSectionId" component={requireAuthentication(QuestionSet, rulesMatrix.rule3)} />
   <Route path="/question/:sdId/:sectionId/:subSectionId/:questionId" component={requireAuthentication(Question, rulesMatrix.rule3)} />
   <Route path="/createSuppDiagnostic" component={requireAuthentication(CreateSupplierDiagnostic, rulesMatrix.rule3)} />
    <Route path="/file/:type" component={requireAuthentication(Files, rulesMatrix.rule3)} />
   <Route status={404} path="*" component={ Home } />
 </Route>
);

export default rootView;
