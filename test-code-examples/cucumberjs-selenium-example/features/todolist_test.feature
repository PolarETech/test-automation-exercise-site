@todo @desktop
Feature: TodoList view test

  Background:
    Given I am already logged in
    And I am on the TodoList view

  @smoke
  Scenario: displays 'TodoList' page
    Then the page title should be correct as the TodoList view
    And the Navigation-Bar should be displayed in the header
    And the 'h1' element should have the correct text as the TodoList view
    And the Empty-Message should be displayed in the TodoList view
    And the Empty-Message should have the correct text emptyMessage in the TodoList view
    And the Todo-List should NOT be displayed in the TodoList view
    And the Subject-Input-Form should be displayed in the TodoList view
    And the Subject-Submit-Button should be displayed in the TodoList view
    And the Subject-Submit-Button should be disabled in the TodoList view
    And the Item-Count should have the correct text initialCountMessage in the TodoList view
    And the 'footer' element should have the correct text as the TodoList view

  @smoke
  Scenario: adds a ToDo item
    When I input 'テストアイテム' in the Subject-Input-Form in the TodoList view
    Then the Subject-Submit-Button should be enabled in the TodoList view
    When I register the todo in the TodoList view
    Then the Empty-Message should NOT be displayed in the TodoList view
    And the Todo-List should be displayed in the TodoList view
    And the 1st Todo-Subject should have the text 'テストアイテム' in the TodoList view
    And the 1st Todo-Checkbox should NOT be checked in the TodoList view
    And the 1st Todo-Timestamp should contain the registration date and time in the TodoList view
    And the Item-Count should have the text '登録件数：1 / 5 件' in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view
    And the 1st 'isDone' data in the Todo storage items should match the data on the view
    And the 1st 'timestamp' data in the Todo storage items should match the data on the view

  @smoke 
  Scenario: changes ToDo item checkbox to ON
    When I input 'テストアイテム' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the 1st Todo-Checkbox should NOT be checked in the TodoList view
    And the 1st Todo-Timestamp should contain the registration date and time in the TodoList view
    When I wait 1000 ms to advance timestamp
    And I click the 1st Todo-Checkbox-Click-Area in the TodoList view
    Then the 1st Todo-Checkbox should be checked in the TodoList view
    And the 1st Todo-Timestamp should contain the updated date and time in the TodoList view
    And the 1st 'isDone' data in the Todo storage items should match the data on the view
    And the 1st 'timestamp' data in the Todo storage items should match the data on the view

  @smoke
  Scenario: changes ToDo item checkbox to OFF
    When I input 'テストアイテム' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    And I click the 1st Todo-Checkbox-Click-Area in the TodoList view
    Then the 1st Todo-Checkbox should be checked in the TodoList view
    When I wait 1000 ms to advance timestamp
    And I click the 1st Todo-Checkbox-Click-Area in the TodoList view
    Then the 1st Todo-Checkbox should NOT be checked in the TodoList view
    And the 1st Todo-Timestamp should contain the updated date and time in the TodoList view
    And the 1st 'isDone' data in the Todo storage items should match the data on the view
    And the 1st 'timestamp' data in the Todo storage items should match the data on the view

  @smoke
  Scenario: changes a ToDo item subject
    When I input 'テストアイテム１' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the 1st Todo-Subject should have the text 'テストアイテム１' in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view
    When I input '%%backspace%%' in the 1st Todo-Subject in the TodoList view
    And I input '２' in the 1st Todo-Subject in the TodoList view
    Then the 1st Todo-Subject should have the text 'テストアイテム２' in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view

  @smoke
  Scenario: re-order ToDo items
    When I input 'テストアイテム１' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    And I input 'テストアイテム２' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the 1st Todo-Subject should have the text 'テストアイテム１' in the TodoList view
    And the 2nd Todo-Subject should have the text 'テストアイテム２' in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view
    And the 2nd 'subject' data in the Todo storage items should match the data on the view
    When I drag and drop the 1st Todo-Drag-Icon onto the 2nd Todo-Drag-Icon
    Then the 1st Todo-Subject should have the text 'テストアイテム２' in the TodoList view
    And the 2nd Todo-Subject should have the text 'テストアイテム１' in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view
    And the 2nd 'subject' data in the Todo storage items should match the data on the view

  @smoke
  Scenario: removes a ToDo item and the list is empty
    When I input 'テストアイテム１' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the 1st Todo-Subject should have the text 'テストアイテム１' in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view
    When I click the 1st Todo-Remove-Button in the TodoList view
    Then the Todo-Subject should NOT be displayed in the TodoList view
    And the the Todo storage items should be empty
    And the Empty-Message should be displayed in the TodoList view
    And the Empty-Message should have the correct text emptyMessage in the TodoList view

  Scenario: removes a ToDo item and another ToDo item remains in the list
    When I input 'テストアイテム１' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    And I input 'テストアイテム２' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the 1st Todo-Subject should have the text 'テストアイテム１' in the TodoList view
    And the 2nd Todo-Subject should have the text 'テストアイテム２' in the TodoList view
    And the Item-Count should have the text '登録件数：2 / 5 件' in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view
    And the 2nd 'subject' data in the Todo storage items should match the data on the view
    When I click the 1st Todo-Remove-Button in the TodoList view
    Then the 1st Todo-Subject should have the text 'テストアイテム２' in the TodoList view
    And the Item-Count should have the text '登録件数：1 / 5 件' in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view
    And the Empty-Message should NOT be displayed in the TodoList view

  Scenario: stores a ToDo item after logging out/in
    When I input 'テストアイテム１' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the 1st Todo-Subject should have the text 'テストアイテム１' in the TodoList view
    When I click the 1st Todo-Checkbox-Click-Area in the TodoList view
    Then the 1st Todo-Checkbox should be checked in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view
    And the 1st 'isDone' data in the Todo storage items should match the data on the view
    And the 1st 'timestamp' data in the Todo storage items should match the data on the view
    When I click the 'Logout' link in the header
    Then the page title should be correct as the Home view
    When I click the 'TodoList' link in the header
    Then the page title should be correct as the Login view
    When I input the valid user id in the Login view
    And I input the valid user password in the Login view
    And I click the Login-Button in the Login view
    Then the page title should be correct as the TodoList view
    And the 1st Todo-Subject should have the text 'テストアイテム１' in the TodoList view
    And the 1st Todo-Checkbox should be checked in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view
    And the 1st 'isDone' data in the Todo storage items should match the data on the view
    And the 1st 'timestamp' data in the Todo storage items should match the data on the view

  Scenario: adds the ToDo item which has maximum number of characters
    When I input '1234567890ABCDE' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the 1st Todo-Subject should have the text '1234567890ABCDE' in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view

  Scenario: tries to add the ToDo item which has exceeded the number of characters
    When I input '1234567890ABCDEF' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the 1st Todo-Subject should have the text '1234567890ABCDE' in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view

  Scenario Outline: adds the ToDo item which has each character type
    When I input the subject variation No. <dataNo> in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the 1st Todo-Subject should have the text of subject variation No. <dataNo> in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view

    Examples:
    | dataNo |
    | 1      |
    | 2      |
    | 3      |
    | 4      |
    | 5      |
    | 6      |

  Scenario: adds maximum number of Todo items
    When I input 'テストアイテム１' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the Item-Count should have the text '登録件数：1 / 5 件' in the TodoList view
    When I input 'テストアイテム２' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the Item-Count should have the text '登録件数：2 / 5 件' in the TodoList view
    When I input 'テストアイテム３' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the Item-Count should have the text '登録件数：3 / 5 件' in the TodoList view
    When I input 'テストアイテム４' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the Item-Count should have the text '登録件数：4 / 5 件' in the TodoList view
    When I input 'テストアイテム５' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the Item-Count should have the text '登録件数：5 / 5 件' in the TodoList view
    And the Subject-Input-Form should NOT be displayed in the TodoList view
    And the Subject-Submit-Button should NOT be displayed in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view
    And the 2st 'subject' data in the Todo storage items should match the data on the view
    And the 3st 'subject' data in the Todo storage items should match the data on the view
    And the 4st 'subject' data in the Todo storage items should match the data on the view
    And the 5st 'subject' data in the Todo storage items should match the data on the view

  Scenario: tries to change a ToDo item subject to empty
    When I input 'テストアイテム１' in the Subject-Input-Form in the TodoList view
    And I register the todo in the TodoList view
    Then the 1st Todo-Subject should have the text 'テストアイテム１' in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view
    When I clear the 1st Todo-Subject in the TodoList view
    Then the 1st Todo-Subject should have the text 'テストアイテム１' in the TodoList view
    And the 1st 'subject' data in the Todo storage items should match the data on the view
