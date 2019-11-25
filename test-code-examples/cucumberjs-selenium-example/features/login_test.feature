@login @desktop
Feature: Login view test

  @sanity
  Scenario: displays 'Login' page
    Given I am on the Login view
    Then the page title should be correct as the Login view
    And the Navigation-Bar should be displayed in the header
    And the 'h1' element should have the correct text as the Login view
    And the UserID-Input-Form should be displayed in the Login view
    And the Password-Input-Form should be displayed in the Login view
    And the Login-Button should be displayed in the Login view
    And the Login-Button should be disabled in the Login view
    And the Require-Login-Message should NOT be displayed in the Login view
    And the Login-Error-Message should NOT be displayed in the Login view
    And the 'footer' element should have the correct text as the Login view

  @sanity
  Scenario: moves to TodoList view and sets auth token cookie after selecting 'Login' button with valid ID and Password
    Given I am on the Login view
    When I input the valid user id in the Login view
    And I input the valid user password in the Login view
    Then the Login-Button should be enabled in the Login view
    When I click the Login-Button in the Login view
    Then the page title should be correct as the TodoList view
    And the login token cookie should be stored correctly

  Scenario: shows error message after selecting 'Login' button with invalid ID and Password
    Given I am on the Login view
    When I input the invalid user id in the Login view
    And I input the invalid user password in the Login view
    And I click the Login-Button in the Login view
    Then the Login-Error-Message should be displayed in the Login view
    And the Login-Error-Message should have the correct text errorMessage in the Login view

  Scenario: shows require log-in message if user accessed Login view by redirect
    Given I am on the TodoList view
    Then the page title should be correct as the Login view
    And the Require-Login-Message should be displayed in the Login view
    And the Require-Login-Message should have the correct text requireMessage in the Login view
