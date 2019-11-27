@home @desktop
Feature: Home view test

  @smoke
  Scenario: displays 'Home' page
    Given I am on the Home view
    Then the page title should be correct as the Home view
    And the Navigation-Bar should be displayed in the header
    And the 'h1' element should have the correct text as the Home view
    And the About-Button should be displayed in the Home view
    And the TodoList-Button should be displayed in the Home view
    And the 'footer' element should have the correct text as the Home view

  Scenario: moves to About view after selecting 'About' button
    Given I am on the Home view
    When I click the About-Button in the Home view
    Then the page title should be correct as the About view

  Scenario: moves to Login view after selecting 'Todo' button without logged in
    Given I am on the Home view
    When I click the TodoList-Button in the Home view
    Then the page title should be correct as the Login view

  Scenario: moves to TodoList view after selecting 'Todo' button with logged in
    Given I am already logged in
    And I am on the Home view
    When I click the TodoList-Button in the Home view
    Then the page title should be correct as the TodoList view
