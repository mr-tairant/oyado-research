import {translationApproved} from '../../scripts/international-review.mjs';
import type {Locale} from './international';
export const internationalApproved:Record<Locale,boolean>={ko:translationApproved('ko'),'zh-cn':translationApproved('zh-cn')};
