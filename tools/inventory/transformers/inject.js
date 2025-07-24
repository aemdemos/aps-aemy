/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-disable no-console */
(() => {
  const mainElement = document.querySelector('main.main.left-nav-column');
  if (mainElement) {
    mainElement.style.flexDirection = 'column';

    // make all direct children span the full width
    Array.from(mainElement.children).forEach((child) => {
      child.style.width = '100%';
    });
  }
})();
