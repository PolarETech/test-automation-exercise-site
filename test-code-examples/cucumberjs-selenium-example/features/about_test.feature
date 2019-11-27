@about @desktop
Feature: About view test

  Background:
    Given I am on the About view

  @smoke
  Scenario: displays 'About' page
    Then the page title should be correct as the About view
    And the Navigation-Bar should be displayed in the header
    And the 'h1' element should have the correct text as the About view
    And the About-Tab should have the correct tab list in the About view
    And the 'footer' element should have the correct text as the About view

  Scenario Outline: displays "Test Contents" tab
    When I click the <number> tab in the About view
    Then the <number> tab content is displayed in the About view
    And the <number> tab content should have the correct headers in the About view

    Examples:
    | number |
    | 1st    |
    | 2nd    |
    | 3rd    |
    | 4th    |
